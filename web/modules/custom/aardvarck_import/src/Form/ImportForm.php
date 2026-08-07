<?php

namespace Drupal\aardvarck_import\Form;

use Drupal\aardvarck_import\Batch\WorkImportBatch;
use Drupal\aardvarck_import\Service\WorkImporter;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Upload form for bulk / ad-hoc importing portfolio "work" content.
 */
class ImportForm extends FormBase {

  public function __construct(
    protected FileSystemInterface $fileSystem,
    protected WorkImporter $workImporter,
  ) {}

  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('file_system'),
      $container->get('aardvarck_import.work_importer'),
    );
  }

  public function getFormId(): string {
    return 'aardvarck_import_import_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state): array {
    $form['help'] = [
      '#type' => 'markup',
      '#markup' => '<p>' . $this->t('Upload a .zip archive containing one or more work packages: a YAML metadata file (e.g. WDABKMO_001.yml) plus one or more matching images (e.g. WDABKMO_001.jpg, WDABKMO_001_1.jpg, WDABKMO_001_2.jpg, ...). Subfolders inside the zip are allowed and ignored — all files are matched by filename. See the module README.md for full details.') . '</p>',
    ];

    $form['zip_file'] = [
      '#type' => 'file',
      '#title' => $this->t('Import package (.zip)'),
      '#description' => $this->t('A zip archive of work YAML files and images.'),
      '#required' => TRUE,
    ];

    $form['overwrite'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Overwrite existing works'),
      '#description' => $this->t('If checked, works that already exist (matched on their ID) will be updated, and their teaser images fully replaced. If unchecked (default), existing works are left untouched and reported as skipped.'),
      '#default_value' => FALSE,
    ];

    $form['actions'] = ['#type' => 'actions'];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Upload and import'),
    ];

    return $form;
  }

  public function validateForm(array &$form, FormStateInterface $form_state): void {
    $validators = ['FileExtension' => ['extensions' => 'zip']];
    // Passing delta 0 returns a single File entity (not an array).
    $file = file_save_upload('zip_file', $validators, 'temporary://', 0, FileSystemInterface::EXISTS_REPLACE);
    if (!$file) {
      $form_state->setErrorByName('zip_file', $this->t('Please upload a valid .zip file.'));
      return;
    }
    $form_state->set('uploaded_file', $file);
  }

  public function submitForm(array &$form, FormStateInterface $form_state): void {
    /** @var \Drupal\file\FileInterface $file */
    $file = $form_state->get('uploaded_file');
    $overwrite = (bool) $form_state->getValue('overwrite');

    $zipPath = $this->fileSystem->realpath($file->getFileUri());
    $extractDir = $this->fileSystem->realpath('temporary://') . '/aardvarck_import_' . uniqid();
    $this->fileSystem->mkdir($extractDir, 0775, TRUE);

    $zip = new \ZipArchive();
    if ($zip->open($zipPath) !== TRUE) {
      $this->messenger()->addError($this->t('Could not open the uploaded zip file.'));
      return;
    }
    $zip->extractTo($extractDir);
    $zip->close();
    // The uploaded temporary zip file itself is no longer needed.
    $file->delete();

    $scan = $this->workImporter->scanDirectory($extractDir);

    if (empty($scan['groups']) && empty($scan['errors'])) {
      $this->messenger()->addWarning($this->t('No work packages (YAML + images) were found in the uploaded zip.'));
      return;
    }

    $batchBuilder = (new \Drupal\Core\Batch\BatchBuilder())
      ->setTitle($this->t('Importing portfolio work'))
      ->setInitMessage($this->t('Starting import...'))
      ->setProgressMessage($this->t('Processed @current out of @total.'))
      ->setErrorMessage($this->t('An error occurred during import.'))
      ->setFinishCallback([WorkImportBatch::class, 'finished']);

    foreach ($scan['groups'] as $group) {
      $batchBuilder->addOperation([WorkImportBatch::class, 'importWork'], [$group, $overwrite]);
    }
    foreach ($scan['errors'] as $error) {
      $batchBuilder->addOperation([WorkImportBatch::class, 'recordError'], [$error]);
    }

    batch_set($batchBuilder->toArray());
    $form_state->setRedirect('aardvarck_import.report');
  }

}

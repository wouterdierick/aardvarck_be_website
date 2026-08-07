<?php

namespace Drupal\aardvarck_import\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configuration form for the Aardvarck import module.
 */
class SettingsForm extends ConfigFormBase {

  public function getFormId(): string {
    return 'aardvarck_import_settings_form';
  }

  protected function getEditableConfigNames(): array {
    return ['aardvarck_import.settings'];
  }

  public function buildForm(array $form, FormStateInterface $form_state): array {
    $config = $this->config('aardvarck_import.settings');

    $form['max_image_dimension'] = [
      '#type' => 'number',
      '#title' => $this->t('Maximum image dimension (px)'),
      '#description' => $this->t('Uploaded images are downscaled, preserving aspect ratio, so that neither their width nor height exceeds this value.'),
      '#default_value' => $config->get('max_image_dimension'),
      '#min' => 100,
      '#required' => TRUE,
    ];

    return parent::buildForm($form, $form_state);
  }

  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $this->config('aardvarck_import.settings')
      ->set('max_image_dimension', (int) $form_state->getValue('max_image_dimension'))
      ->save();
    parent::submitForm($form, $form_state);
  }

}

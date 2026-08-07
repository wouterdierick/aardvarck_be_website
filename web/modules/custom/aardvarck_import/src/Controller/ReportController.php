<?php

namespace Drupal\aardvarck_import\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\TempStore\PrivateTempStoreFactory;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Displays the results of the most recent portfolio import batch.
 */
class ReportController extends ControllerBase {

  public function __construct(
    protected PrivateTempStoreFactory $tempStoreFactory,
  ) {}

  public static function create(ContainerInterface $container) {
    return new static($container->get('tempstore.private'));
  }

  public function build(): array {
    $results = $this->tempStoreFactory->get('aardvarck_import')->get('report');

    if (empty($results)) {
      return [
        '#markup' => '<p>' . $this->t('No import report available. Run an import from the <a href=":url">import form</a> first.', [
          ':url' => \Drupal\Core\Url::fromRoute('aardvarck_import.import_form')->toString(),
        ]) . '</p>',
      ];
    }

    $rows = [];
    foreach ($results as $result) {
      $statusLabels = [
        'created' => $this->t('Created'),
        'updated' => $this->t('Updated'),
        'skipped' => $this->t('Skipped'),
        'error' => $this->t('Error'),
      ];
      $notes = [$result['message']];
      foreach ($result['warnings'] ?? [] as $warning) {
        $notes[] = '⚠ ' . $warning;
      }
      $rows[] = [
        'data' => [
          $result['id'],
          $statusLabels[$result['status']] ?? $result['status'],
          ['data' => ['#markup' => implode('<br>', array_map('\Drupal\Component\Utility\Html::escape', $notes))]],
        ],
        'class' => ['aardvarck-import-status-' . $result['status']],
      ];
    }

    return [
      'summary' => [
        '#markup' => '<p>' . $this->t('Results of the last import batch run in this browser session.') . '</p>',
      ],
      'table' => [
        '#type' => 'table',
        '#header' => [$this->t('Work ID'), $this->t('Result'), $this->t('Notes')],
        '#rows' => $rows,
        '#empty' => $this->t('No results.'),
      ],
    ];
  }

}

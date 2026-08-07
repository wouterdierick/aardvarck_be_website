<?php

namespace Drupal\aardvarck_import\Batch;

/**
 * Batch API operation + finished callbacks for the portfolio import.
 */
class WorkImportBatch {

  /**
   * Batch operation: imports a single work group.
   *
   * @param array $group
   *   A group as returned by WorkImporter::scanDirectory().
   * @param bool $overwrite
   *   Whether to overwrite existing works.
   * @param array $context
   *   Batch context.
   */
  public static function importWork(array $group, bool $overwrite, array &$context): void {
    /** @var \Drupal\aardvarck_import\Service\WorkImporter $importer */
    $importer = \Drupal::service('aardvarck_import.work_importer');
    $result = $importer->importWorkGroup($group, $overwrite);
    $context['results'][] = $result;
    $context['message'] = t('Processing @id...', ['@id' => $result['id']]);
  }

  /**
   * Batch operation: records a structural validation error (no processing).
   *
   * @param array $error
   *   ['id' => string, 'message' => string].
   * @param array $context
   *   Batch context.
   */
  public static function recordError(array $error, array &$context): void {
    $context['results'][] = [
      'id' => $error['id'],
      'status' => 'error',
      'message' => $error['message'],
      'warnings' => [],
    ];
  }

  /**
   * Batch finished callback: stores the report for display and messages.
   *
   * @param bool $success
   *   Whether the batch completed without a fatal PHP error.
   * @param array $results
   *   The accumulated $context['results'] from all operations.
   * @param array $operations
   *   Any operations that were not completed (if $success is FALSE).
   */
  public static function finished(bool $success, array $results, array $operations): void {
    $tempstore = \Drupal::service('tempstore.private')->get('aardvarck_import');
    $tempstore->set('report', $results);

    if (!$success) {
      \Drupal::messenger()->addError(t('The import batch did not complete successfully. See the report for details of what was processed.'));
      return;
    }

    $counts = ['created' => 0, 'updated' => 0, 'skipped' => 0, 'error' => 0];
    foreach ($results as $result) {
      $counts[$result['status']] = ($counts[$result['status']] ?? 0) + 1;
    }
    \Drupal::messenger()->addStatus(t('Import finished: @created created, @updated updated, @skipped skipped, @error errors.', [
      '@created' => $counts['created'],
      '@updated' => $counts['updated'],
      '@skipped' => $counts['skipped'],
      '@error' => $counts['error'],
    ]));
  }

}

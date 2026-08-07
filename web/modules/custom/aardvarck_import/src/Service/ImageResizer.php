<?php

namespace Drupal\aardvarck_import\Service;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\File\FileSystemInterface;
use Drupal\Core\Image\ImageFactory;
use Drupal\file\FileInterface;

/**
 * Resizes images to a maximum dimension and saves them as permanent files.
 */
class ImageResizer {

  public function __construct(
    protected ImageFactory $imageFactory,
    protected FileSystemInterface $fileSystem,
    protected EntityTypeManagerInterface $entityTypeManager,
    protected ConfigFactoryInterface $configFactory,
  ) {}

  /**
   * Resizes (if needed) and saves a source image as a permanent file.
   *
   * The image is downscaled, preserving aspect ratio, so that neither
   * dimension exceeds the configured maximum (default 2400px, see
   * aardvarck_import.settings:max_image_dimension). If the image is already
   * within bounds it is copied as-is (no quality loss from re-encoding).
   *
   * @param string $sourcePath
   *   Absolute filesystem path to the source image (e.g. an extracted zip
   *   entry).
   * @param string $destinationDirectory
   *   The public:// directory to save into, e.g.
   *   'public://work/2024/WDABKMO_001'. Created if it doesn't exist.
   * @param string $filename
   *   The filename to save as, e.g. 'WDABKMO_001_1.jpg'.
   *
   * @return \Drupal\file\FileInterface
   *   The saved, permanent file entity.
   *
   * @throws \RuntimeException
   *   If the image can't be read or saved.
   */
  public function resizeAndSave(string $sourcePath, string $destinationDirectory, string $filename): FileInterface {
    $maxDimension = (int) $this->configFactory->get('aardvarck_import.settings')->get('max_image_dimension') ?: 2400;

    $this->fileSystem->prepareDirectory($destinationDirectory, FileSystemInterface::CREATE_DIRECTORY | FileSystemInterface::MODIFY_PERMISSIONS);
    $destinationUri = $destinationDirectory . '/' . $filename;

    $image = $this->imageFactory->get($sourcePath);
    if (!$image->isValid()) {
      throw new \RuntimeException("Could not read image: $sourcePath");
    }

    $width = $image->getWidth();
    $height = $image->getHeight();

    if ($width > $maxDimension || $height > $maxDimension) {
      $scale = min($maxDimension / $width, $maxDimension / $height);
      $newWidth = (int) round($width * $scale);
      $newHeight = (int) round($height * $scale);
      if (!$image->resize($newWidth, $newHeight)) {
        throw new \RuntimeException("Failed to resize image: $sourcePath");
      }
      if (!$image->save($destinationUri)) {
        throw new \RuntimeException("Failed to save resized image to: $destinationUri");
      }
    }
    else {
      // Already within bounds: copy verbatim, no re-encoding/quality loss.
      $this->fileSystem->copy($sourcePath, $destinationUri, FileSystemInterface::EXISTS_REPLACE);
    }

    /** @var \Drupal\file\FileInterface $file */
    $file = $this->entityTypeManager->getStorage('file')->create([
      'uri' => $destinationUri,
      'status' => FileInterface::STATUS_PERMANENT,
    ]);
    $file->save();

    return $file;
  }

}

#!/bin/bash
# Created automatically by Cursor AI (2024-12-19)

set -e

echo "Setting up MinIO..."

# Wait for MinIO to be ready
sleep 10

# Configure MinIO client
mc alias set local http://minio:9000 minioadmin minioadmin

# Create bucket
mc mb local/crisis-crew --ignore-existing

# Set bucket policy for public read (for exports)
mc policy set download local/crisis-crew

# Create folders for different content types
mc cp --recursive /dev/null local/crisis-crew/exports/
mc cp --recursive /dev/null local/crisis-crew/uploads/
mc cp --recursive /dev/null local/crisis-crew/evidence/

echo "MinIO setup completed!"

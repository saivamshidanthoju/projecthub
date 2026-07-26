#!/bin/bash

# Configuration settings
BACKUP_DIR="/tmp/backups"
S3_BUCKET="s3://projecthub-db-backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_NAME="projecthub_backup_$TIMESTAMP.sql.gz"
RETENTION_DAYS=7

echo "📅 Starting backup execution at $(date)"

# Ensure backup directories exist locally
mkdir -p "$BACKUP_DIR"

# Run PostgreSQL dump using pg_dump utility and compress it
if pg_dump -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_DIR/$BACKUP_NAME"; then
    echo "✅ Database dump completed successfully: $BACKUP_NAME"
else
    echo "❌ Database dump execution failed."
    exit 1
fi

# Upload compressed backup SQL dump file to AWS S3 storage bucket
if aws s3 cp "$BACKUP_DIR/$BACKUP_NAME" "$S3_BUCKET/$BACKUP_NAME"; then
    echo "✅ Backup successfully uploaded to S3: $S3_BUCKET/$BACKUP_NAME"
else
    echo "❌ Upload to AWS S3 storage failed."
    exit 1
fi

# Remove local backup file
rm "$BACKUP_DIR/$BACKUP_NAME"

# Delete files older than 7 days from S3 bucket to maintain retention limits
echo "🧹 Applying retention policy window..."
aws s3api list-objects --bucket "${S3_BUCKET#s3://}" --query "Contents[?LastModified < '$(date -d "$RETENTION_DAYS days ago" +%Y-%m-%d)'].Key" --output text | xargs -I {} aws s3 rm "$S3_BUCKET/{}"

echo "🎉 Backup processing finished successfully."

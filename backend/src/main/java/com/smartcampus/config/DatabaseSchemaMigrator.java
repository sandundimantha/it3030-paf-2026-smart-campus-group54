package com.smartcampus.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@RequiredArgsConstructor
public class DatabaseSchemaMigrator implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseSchemaMigrator.class);
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        logger.info("Starting safe Database Schema Migration for ID transition...");
        
        try {
            migrateColumn("bookings", "user_id");
            migrateColumn("bookings", "resource_id");
            migrateColumn("incidents", "reported_by");
            migrateColumn("notifications", "user_id");
            migrateColumn("comments", "autor_id");
            migrateColumn("comments", "incident_id");
            
            // Ensure Maintenance Hub Tables exist
            createMaintenanceTables();
            
            logger.info("Database Schema Migration sequence COMPLETED.");
        } catch (Exception e) {
            logger.error("Error during schema migration: {}", e.getMessage());
        }
    }

    private void createMaintenanceTables() {
        try {
            // Create maintenance_tickets table
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS maintenance_tickets (" +
                "  id BIGSERIAL PRIMARY KEY," +
                "  category VARCHAR(255) NOT NULL," +
                "  description VARCHAR(1000) NOT NULL," +
                "  location VARCHAR(255) NOT NULL," +
                "  priority VARCHAR(50) NOT NULL," +
                "  status VARCHAR(50) NOT NULL," +
                "  reporter_id VARCHAR(255) NOT NULL," +
                "  technician_id VARCHAR(255)," +
                "  resolved_at TIMESTAMP," +
                "  feedback_comment VARCHAR(1000)," +
                "  feedback_rating INTEGER," +
                "  feedback_at TIMESTAMP," +
                "  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP," +
                "  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP" +
                ")"
            );

            // Create maintenance_images table
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS maintenance_images (" +
                "  id BIGSERIAL PRIMARY KEY," +
                "  image_url TEXT NOT NULL," +
                "  ticket_id BIGINT REFERENCES maintenance_tickets(id) ON DELETE CASCADE" +
                ")"
            );
            
            logger.info("Maintenance Hub tables verified/created successfully.");
        } catch (Exception e) {
            logger.error("Error creating Maintenance Hub tables: {}", e.getMessage());
        }
    }

    private void migrateColumn(String tableName, String columnName) {
        try {
            String sql = String.format(
                "DO $$ " +
                "BEGIN " +
                "  IF EXISTS (SELECT 1 FROM information_schema.columns " +
                "             WHERE table_name = '%s' AND column_name = '%s' AND data_type = 'character varying') THEN " +
                "    EXECUTE 'ALTER TABLE %s ALTER COLUMN %s TYPE bigint USING (CASE WHEN %s ~ ''^[0-9]+$'' THEN %s::bigint ELSE NULL END)'; " +
                "  END IF; " +
                "END $$;",
                tableName, columnName, tableName, columnName, columnName, columnName
            );
            jdbcTemplate.execute(sql);
        } catch (Exception e) {
            logger.warn("Skipping migration for {}.{}: {}", tableName, columnName, e.getMessage());
        }
    }
}

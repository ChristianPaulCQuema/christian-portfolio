ALTER TABLE users
ADD COLUMN main_hr_lock VARCHAR(255)
GENERATED ALWAYS AS (
    CASE 
        WHEN LOWER(email) = 'hr@paterostechnologicalcollege.edu.ph' 
        THEN LOWER(email)
        ELSE NULL
    END
) STORED;

ALTER TABLE users
ADD UNIQUE KEY unique_main_hr_only (main_hr_lock);
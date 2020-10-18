BEGIN;
delete from speakers where true;

copy speakers(speaker_id, display_name,accent,"location",year_of_birth,gender) 
FROM '/pg_share/speakers.csv'
DELIMITER ','
CSV HEADER;

COMMIT;

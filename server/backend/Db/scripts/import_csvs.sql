BEGIN;
--delete from speakers where true;
copy words from '/pg_share/words.csv' delimiter ',' csv header;
copy prons from '/pg_share/prons.csv' delimiter ',' csv header;
copy extensions from '/pg_share/extensions.csv' delimiter ',' csv header;
copy speakers(speaker_id,display_name,accent,location,year_of_birth,gender) from '/pg_share/speakers.csv' delimiter ',' csv header;
copy audio_clips from '/pg_share/audio_clips.csv' delimiter ',' csv header;
copy word_lists from '/pg_share/word_lists.csv' delimiter ',' csv header;
copy word_audio_clips from '/pg_share/word_audio_clips.csv' delimiter ',' csv header;

COMMIT;

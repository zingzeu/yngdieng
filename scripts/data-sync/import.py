#!/usr/bin/env python3

# Imports data from CSV files into Postgres database
#
# WARNING: this wipes all existing data.

import argparse
import pathlib
import psycopg2

parser = argparse.ArgumentParser(
    description="Imports data from CSV files into Postgres database.")

parser.add_argument('zingzeu_data_path', type=pathlib.Path,
                    help="Path to the root of zingzeu-data repo")
parser.add_argument('--db_host', default='localhost',
                    help="Host of Postgres database")
parser.add_argument('--db_port', default='5432',
                    help="Port of Postgres database")
parser.add_argument('--db_user', default='postgres', help="Postgres username")
parser.add_argument('--db_password', default='postgres',
                    help="Postgres password")
parser.add_argument('--database', default='yngdieng',
                    help="Name of the database")
parser.add_argument('--yes', action='store_true',
                    help="Skip confirmation")

args = parser.parse_args()


def copyCsv(cur, tableName, filePath):
    with open(args.zingzeu_data_path.joinpath(filePath), 'r') as f:
        cur.copy_expert(
            f"copy {tableName} from STDIN delimiter ',' csv header", f)


def confirm():
    if args.yes:
        return

    print()
    print(f"WARNING: all existing data will be wiped")
    print("Do you want continue? (y/N)", end=None, flush=True)

    choice = input()

    if not (choice.strip().lower() == 'y'):
        exit(-1)


print(
    f"Importing into database `{args.database}` at {args.db_host}:{args.db_port}.")

confirm()

with psycopg2.connect(
        database=args.database,
        user=args.db_user,
        password=args.db_password,
        host=args.db_host,
        port=args.db_port) as conn:
    with conn.cursor() as cur:
        cur.execute("""
            delete from word_audio_clips where true;
            delete from word_list_words where true;
            delete from word_lists where true;
            delete from extensions where true;
            delete from prons where true;
            delete from words where true;
            delete from audio_clips where true;
            delete from speakers where true;""")
        copyCsv(cur, 'speakers', 'speakers.csv')
        copyCsv(cur, 'audio_clips', 'generated/audio_clips.csv')
        copyCsv(cur, 'words', 'generated/words.csv')
        copyCsv(cur, 'prons', 'generated/prons.csv')
        copyCsv(cur, 'extensions', 'generated/extensions.csv')
        copyCsv(cur, 'word_lists', 'word_lists.csv')
        copyCsv(cur, 'word_list_words', 'word_list_words.csv')
        copyCsv(cur, 'word_audio_clips', 'generated/word_audio_clips.csv')
        conn.commit()

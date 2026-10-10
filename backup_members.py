#!/usr/bin/env python3
"""
Backup all members from Firebase to JSON and CSV
"""

import requests
import json
import csv
from datetime import datetime

FIREBASE_PROJECT = "churchapp-74dec"
FIREBASE_API_KEY = "AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g"
FIRESTORE_URL = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT}/databases/(default)/documents/members"

def get_all_members():
    """Fetch all members from Firebase"""
    print("📥 Fetching members from Firebase...\n")

    all_members = []
    page_token = None
    page = 1

    while True:
        params = {'key': FIREBASE_API_KEY, 'pageSize': 1000}
        if page_token:
            params['pageToken'] = page_token

        response = requests.get(FIRESTORE_URL, params=params)

        if response.status_code == 200:
            data = response.json()
            docs = data.get('documents', [])

            for doc in docs:
                fields = doc.get('fields', {})
                member = {}

                # Extract all fields
                for key, value in fields.items():
                    if 'stringValue' in value:
                        member[key] = value['stringValue']
                    elif 'integerValue' in value:
                        member[key] = value['integerValue']
                    elif 'booleanValue' in value:
                        member[key] = value['booleanValue']
                    elif 'timestampValue' in value:
                        member[key] = value['timestampValue']
                    else:
                        member[key] = str(value)

                all_members.append(member)

            print(f"  ✅ Page {page}: {len(docs)} members")

            if 'nextPageToken' in data:
                page_token = data['nextPageToken']
                page += 1
            else:
                break
        else:
            print(f"Error: {response.status_code}")
            break

    return all_members

def backup_json(members):
    """Backup to JSON file"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"C:\\Users\\amaze\\Downloads\\Church_Members_Backup_{timestamp}.json"

    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(members, f, indent=2, ensure_ascii=False)

    print(f"\n✅ JSON Backup: {filename}")
    return filename

def backup_csv(members):
    """Backup to CSV file"""
    if not members:
        return None

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"C:\\Users\\amaze\\Downloads\\Church_Members_Backup_{timestamp}.csv"

    # Get all unique keys
    all_keys = set()
    for member in members:
        all_keys.update(member.keys())

    fieldnames = sorted(list(all_keys))

    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(members)

    print(f"✅ CSV Backup: {filename}")
    return filename

def main():
    print("=" * 60)
    print("🏦 Church Nexus - Members Backup")
    print("=" * 60 + "\n")

    # Fetch members
    members = get_all_members()

    print(f"\n📊 Total members: {len(members)}\n")

    if not members:
        print("❌ No members found!")
        return

    # Create backups
    json_file = backup_json(members)
    csv_file = backup_csv(members)

    print(f"\n✅ BACKUP COMPLETE!\n")
    print(f"📁 Backup Location: C:\\Users\\amaze\\Downloads\\")
    print(f"\n📋 Files created:")
    print(f"   1️⃣  JSON: Church_Members_Backup_[timestamp].json")
    print(f"   2️⃣  CSV: Church_Members_Backup_[timestamp].csv")
    print(f"\n💾 Safe to download/store externally!")

if __name__ == '__main__':
    main()

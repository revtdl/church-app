#!/usr/bin/env python3
"""
Clean up duplicate members - Keep only 1 copy of each
"""

import requests
from datetime import datetime, timezone

FIREBASE_PROJECT = "churchapp-74dec"
FIREBASE_API_KEY = "AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g"
FIRESTORE_URL = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT}/databases/(default)/documents"

def get_all_members():
    """Fetch all members"""
    url = f"{FIRESTORE_URL}/members"
    all_members = []
    page_token = None

    while True:
        params = {'key': FIREBASE_API_KEY}
        if page_token:
            params['pageToken'] = page_token

        response = requests.get(url, params=params)

        if response.status_code == 200:
            data = response.json()
            docs = data.get('documents', [])
            all_members.extend(docs)

            if 'nextPageToken' in data:
                page_token = data['nextPageToken']
            else:
                break
        else:
            break

    return all_members

def delete_member(doc_path):
    """Delete a member document"""
    url = f"{FIRESTORE_URL}{doc_path}"
    response = requests.delete(url, params={'key': FIREBASE_API_KEY})
    return response.status_code == 200

def main():
    print("🧹 Cleaning up duplicate members...\n")

    members = get_all_members()
    print(f"📊 Total members: {len(members)}\n")

    # Find duplicates
    seen_names = {}
    to_delete = []

    for doc in members:
        name = doc.get('fields', {}).get('name', {}).get('stringValue', '')
        doc_path = doc.get('name', '')

        if name in seen_names:
            # Duplicate - mark for deletion
            to_delete.append((doc_path, name))
        else:
            # Keep this one
            seen_names[name] = doc_path

    print(f"🗑️  Found {len(to_delete)} duplicates to remove\n")

    if len(to_delete) > 0:
        print("🚀 Deleting duplicates...\n")

        deleted = 0
        for doc_path, name in to_delete:
            if delete_member(doc_path):
                deleted += 1
                percent = int((deleted / len(to_delete)) * 100)
                if deleted % 20 == 0:
                    print(f"  [{percent:3d}%] ✅ Deleted {deleted}/{len(to_delete)} duplicates")

        print(f"\n✅ CLEANED UP!\n")
        print(f"📊 Results:")
        print(f"   • Deleted: {deleted} duplicates")
        print(f"   • Unique members: {len(seen_names)}")
        print(f"   • Total now: {len(seen_names)}\n")
    else:
        print("✅ No duplicates found!\n")

if __name__ == '__main__':
    main()

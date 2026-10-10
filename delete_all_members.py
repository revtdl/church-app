#!/usr/bin/env python3
"""
Force delete all members and reimport clean
"""

import requests
import time

FIREBASE_PROJECT = "churchapp-74dec"
FIREBASE_API_KEY = "AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g"
FIRESTORE_URL = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT}/databases/(default)/documents"

def delete_all_members():
    """Delete all members recursively"""
    print("🧹 Force deleting all members...\n")

    deleted_total = 0

    for attempt in range(5):  # Multiple passes to get everything
        url = f"{FIRESTORE_URL}/members"

        response = requests.get(url, params={
            'key': FIREBASE_API_KEY,
            'pageSize': 1000  # Get max per page
        })

        if response.status_code != 200:
            print(f"Failed to fetch members: {response.status_code}")
            break

        data = response.json()
        docs = data.get('documents', [])

        if len(docs) == 0:
            print(f"✅ Pass {attempt + 1}: No more members to delete")
            break

        print(f"📊 Pass {attempt + 1}: Found {len(docs)} members\n")

        deleted_in_pass = 0
        for doc in docs:
            doc_path = doc['name']
            doc_id = doc_path.split('/')[-1]

            # Try deleting
            del_url = f"{FIRESTORE_URL}/members/{doc_id}"
            del_response = requests.delete(del_url, params={'key': FIREBASE_API_KEY}, timeout=5)

            if del_response.status_code == 200:
                deleted_in_pass += 1
                deleted_total += 1

                if deleted_in_pass % 30 == 0:
                    percent = int((deleted_in_pass / len(docs)) * 100)
                    print(f"  [{percent:3d}%] ✅ Deleted {deleted_in_pass}/{len(docs)}")

            # Rate limit
            if deleted_in_pass % 25 == 0:
                time.sleep(0.3)

        print(f"  ✅ Pass complete: {deleted_in_pass} deleted\n")

        if len(docs) < 100:
            break  # If less than max page size, we got them all

        time.sleep(1)

    print(f"✅ TOTAL DELETED: {deleted_total}\n")

    # Verify final count
    time.sleep(2)
    response = requests.get(
        f"{FIRESTORE_URL}/members",
        params={'key': FIREBASE_API_KEY}
    )
    data = response.json()
    remaining = len(data.get('documents', []))
    print(f"📊 Final member count: {remaining}\n")

    return remaining == 0

if __name__ == '__main__':
    success = delete_all_members()
    if success:
        print("🎉 Database cleared! Ready to import fresh members.\n")
    else:
        print("⚠️  Some members may still remain. Try again.\n")

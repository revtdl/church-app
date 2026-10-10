#!/usr/bin/env python3
"""
Add Sample Events and Sermons to Firebase
"""

import requests
import json
from datetime import datetime, timedelta

FIREBASE_PROJECT = "churchapp-74dec"
FIREBASE_API_KEY = "AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g"
FIRESTORE_URL = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT}/databases/(default)/documents"

def add_events():
    """Add sample events"""
    print("📅 Adding sample events...\n")

    events = [
        {
            "title": "Sunday Service - English",
            "date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
            "time": "10:30 AM",
            "location": "Main Sanctuary",
            "description": "Weekly English worship service",
            "image": "",
            "category": "Service",
            "status": "upcoming"
        },
        {
            "title": "Prayer Meeting",
            "date": (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d"),
            "time": "7:00 PM",
            "location": "Prayer Hall",
            "description": "Weekly prayer and intercession meeting",
            "image": "",
            "category": "Prayer",
            "status": "upcoming"
        },
        {
            "title": "Bible Study - Old Testament",
            "date": (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d"),
            "time": "6:00 PM",
            "location": "Classroom Block",
            "description": "Deep dive into the books of Moses",
            "image": "",
            "category": "Study",
            "status": "upcoming"
        },
        {
            "title": "Youth Fellowship Gathering",
            "date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d"),
            "time": "5:00 PM",
            "location": "Fellowship Hall",
            "description": "Monthly youth gathering and fellowship",
            "image": "",
            "category": "Fellowship",
            "status": "upcoming"
        },
        {
            "title": "Sunday Service - Tamil",
            "date": (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d"),
            "time": "8:00 AM",
            "location": "Main Sanctuary",
            "description": "Weekly Tamil worship service",
            "image": "",
            "category": "Service",
            "status": "upcoming"
        },
    ]

    added = 0
    for event in events:
        try:
            doc_data = {
                "fields": {
                    "title": {"stringValue": event["title"]},
                    "date": {"stringValue": event["date"]},
                    "time": {"stringValue": event["time"]},
                    "location": {"stringValue": event["location"]},
                    "description": {"stringValue": event["description"]},
                    "category": {"stringValue": event["category"]},
                    "status": {"stringValue": event["status"]},
                    "createdAt": {"timestampValue": datetime.now().isoformat()},
                }
            }

            response = requests.post(
                f"{FIRESTORE_URL}/events",
                params={"key": FIREBASE_API_KEY},
                json=doc_data
            )

            if response.status_code in [200, 201]:
                added += 1
                print(f"  ✅ {event['title']}")
            else:
                print(f"  ❌ {event['title']}: {response.status_code}")

        except Exception as e:
            print(f"  ❌ Error: {e}")

    print(f"\n✅ Added {added} events\n")
    return added

def add_sermons():
    """Add sample sermons"""
    print("📖 Adding sample sermons...\n")

    sermons = [
        {
            "title": "The Power of Faith",
            "speaker": "Rev. David Livingston",
            "sermonDate": (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d"),
            "series": "Faith in Action",
            "topic": "Believing the Impossible",
            "description": "A powerful message about having faith in God even when circumstances seem impossible.",
            "text": "",
            "status": "published"
        },
        {
            "title": "Love Never Fails",
            "speaker": "Rev. David Livingston",
            "sermonDate": (datetime.now() - timedelta(days=14)).strftime("%Y-%m-%d"),
            "series": "Love Conquers All",
            "topic": "Love as the Greatest Gift",
            "description": "Exploring how God's love transforms our lives and relationships.",
            "text": "",
            "status": "published"
        },
        {
            "title": "Finding Peace in the Storm",
            "speaker": "Guest Speaker",
            "sermonDate": (datetime.now() - timedelta(days=21)).strftime("%Y-%m-%d"),
            "series": "Peace and Comfort",
            "topic": "God's Peace in Difficult Times",
            "description": "When life seems overwhelming, discover how to find God's peace.",
            "text": "",
            "status": "published"
        },
        {
            "title": "Becoming More Like Christ",
            "speaker": "Rev. David Livingston",
            "sermonDate": (datetime.now() - timedelta(days=28)).strftime("%Y-%m-%d"),
            "series": "Christian Growth",
            "topic": "Spiritual Transformation",
            "description": "Understanding what it means to follow Jesus and grow in our faith.",
            "text": "",
            "status": "published"
        },
        {
            "title": "The Holy Spirit's Role",
            "speaker": "Rev. David Livingston",
            "sermonDate": (datetime.now() - timedelta(days=35)).strftime("%Y-%m-%d"),
            "series": "The Holy Spirit",
            "topic": "Empowerment from Above",
            "description": "How the Holy Spirit guides, empowers, and transforms believers.",
            "text": "",
            "status": "published"
        },
    ]

    added = 0
    for sermon in sermons:
        try:
            doc_data = {
                "fields": {
                    "title": {"stringValue": sermon["title"]},
                    "speaker": {"stringValue": sermon["speaker"]},
                    "sermonDate": {"stringValue": sermon["sermonDate"]},
                    "series": {"stringValue": sermon["series"]},
                    "topic": {"stringValue": sermon["topic"]},
                    "description": {"stringValue": sermon["description"]},
                    "status": {"stringValue": sermon["status"]},
                    "createdAt": {"timestampValue": datetime.now().isoformat()},
                }
            }

            response = requests.post(
                f"{FIRESTORE_URL}/sermons",
                params={"key": FIREBASE_API_KEY},
                json=doc_data
            )

            if response.status_code in [200, 201]:
                added += 1
                print(f"  ✅ {sermon['title']}")
            else:
                print(f"  ❌ {sermon['title']}: {response.status_code}")

        except Exception as e:
            print(f"  ❌ Error: {e}")

    print(f"\n✅ Added {added} sermons\n")
    return added

if __name__ == '__main__':
    print("=" * 60)
    print("🏦 Church Nexus - Add Sample Events & Sermons")
    print("=" * 60 + "\n")

    events_added = add_events()
    sermons_added = add_sermons()

    print(f"📊 Summary:")
    print(f"   ✅ Events: {events_added}")
    print(f"   ✅ Sermons: {sermons_added}")
    print(f"\n🌐 Refresh mobile app to see data!")
    print(f"   Mobile: http://localhost:8000/index.html\n")

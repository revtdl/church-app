#!/usr/bin/env python3
"""
Complete Member Import - No Duplicate Skipping
Imports all 163 members from Excel to Firebase
"""

import openpyxl
import requests
import time
from datetime import datetime, timezone

FIREBASE_PROJECT = "churchapp-74dec"
FIREBASE_API_KEY = "AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g"
FIRESTORE_URL = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT}/databases/(default)/documents/members"
EXCEL_FILE = r"C:\Users\amaze\Downloads\WMC_Membership_List_Final_2026.xlsx"

def read_excel(filepath):
    """Read all members from Excel"""
    try:
        print("📖 Reading Excel file...")
        wb = openpyxl.load_workbook(filepath)
        ws = wb["All Members"]

        members = []
        # Skip first row (headers are in row 1)
        for row_idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True), 2):
            name = str(row[3]).strip() if row[3] else None

            if not name or len(name) < 2 or name == 'None':
                continue

            def safe_col(idx):
                try:
                    val = row[idx] if idx < len(row) else None
                    return str(val).strip() if val and str(val) != 'None' else ''
                except:
                    return ''

            member = {
                'name': name,
                'email': '',
                'phone': '',
                'phone2': '',
                'familyHead': 'Head' if 'Head' in safe_col(5) else 'Dependent',
                'familyNumber': safe_col(2),
                'area': '',
                'address': '',
                'dateOfBirth': safe_col(8),
                'maritalStatus': '',
                'spouseName': safe_col(7),
                'membershipStatus': safe_col(0) or 'Member',
                'monthlyContribution': '',
                'remarks': f"Gender: {safe_col(4)}, POB: {safe_col(10)}",
                'child1': '',
                'child2': '',
                'child3': '',
                'child4': '',
                'dateOfBaptism': safe_col(14),
                'dateOfConfirmation': '',
                'dateOfJoining': '',
                'dateOfLeaving': '',
                'profileImage': None,
            }

            members.append(member)

        return members
    except Exception as e:
        print(f"❌ Error reading Excel: {e}")
        raise

def import_members(members):
    """Import all members to Firebase"""
    print(f"🚀 Importing {len(members)} members...\n")

    imported = 0
    failed = 0

    for idx, member in enumerate(members, 1):
        try:
            doc_data = {
                "fields": {
                    "name": {"stringValue": member['name']},
                    "email": {"stringValue": member['email']},
                    "phone": {"stringValue": member['phone']},
                    "phone2": {"stringValue": member['phone2']},
                    "familyHead": {"stringValue": member['familyHead']},
                    "familyNumber": {"stringValue": member['familyNumber']},
                    "area": {"stringValue": member['area']},
                    "address": {"stringValue": member['address']},
                    "dateOfBirth": {"stringValue": member['dateOfBirth']},
                    "maritalStatus": {"stringValue": member['maritalStatus']},
                    "spouseName": {"stringValue": member['spouseName']},
                    "membershipStatus": {"stringValue": member['membershipStatus']},
                    "monthlyContribution": {"stringValue": member['monthlyContribution']},
                    "remarks": {"stringValue": member['remarks']},
                    "child1": {"stringValue": member['child1']},
                    "child2": {"stringValue": member['child2']},
                    "child3": {"stringValue": member['child3']},
                    "child4": {"stringValue": member['child4']},
                    "dateOfBaptism": {"stringValue": member['dateOfBaptism']},
                    "dateOfConfirmation": {"stringValue": member['dateOfConfirmation']},
                    "dateOfJoining": {"stringValue": member['dateOfJoining']},
                    "dateOfLeaving": {"stringValue": member['dateOfLeaving']},
                    "createdAt": {"timestampValue": datetime.now(timezone.utc).isoformat()},
                }
            }

            response = requests.post(
                FIRESTORE_URL,
                params={"key": FIREBASE_API_KEY},
                json=doc_data,
                timeout=10
            )

            if response.status_code in [200, 201]:
                imported += 1
                percent = int((idx / len(members)) * 100)
                if idx % 10 == 0:
                    print(f"  [{percent:3d}%] ✅ Imported {idx}/{len(members)} - {member['name']}")
            else:
                failed += 1
                print(f"  ❌ {member['name']}: {response.status_code}")

            if idx % 15 == 0:
                time.sleep(0.3)

        except Exception as e:
            failed += 1

    print(f"\n✅ COMPLETE!\n")
    print(f"📊 Results:")
    print(f"   ✅ Imported: {imported}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📈 Total in Firebase: {imported + failed}\n")
    print(f"🌐 View: http://localhost:8000/admin-portal.html\n")

if __name__ == '__main__':
    try:
        print("=" * 50)
        print("🏦 Church Nexus - Complete Member Import")
        print("=" * 50 + "\n")

        members = read_excel(EXCEL_FILE)
        print(f"✅ Loaded {len(members)} members\n")

        import_members(members)

    except Exception as e:
        print(f"\n❌ Error: {e}")

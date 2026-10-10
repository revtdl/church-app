#!/usr/bin/env python3
"""
Complete Member Import with ALL Available Columns
"""

import openpyxl
import requests
import time
from datetime import datetime, timezone

FIREBASE_PROJECT = "churchapp-74dec"
FIREBASE_API_KEY = "AIzaSyDXN2CFtyuZQbGKJbciB8Nm9WYTGVxXQ6g"
FIRESTORE_URL = f"https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT}/databases/(default)/documents/members"
EXCEL_FILE = r"C:\Users\amaze\Downloads\WMC_Membership_List_Final_2026.xlsx"

def read_excel_complete(filepath):
    """Read all members with ALL available columns"""
    try:
        print("📖 Reading Excel file with complete data...")
        wb = openpyxl.load_workbook(filepath)
        ws = wb["All Members"]

        members = []

        # Skip first row (headers)
        for row_idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True), 2):
            # Column mapping (1-indexed in Excel, 0-indexed in Python tuple)
            # Columns: 1=Category, 2=S.No, 3=Family#, 4=Name, 5=Gender, 6=Head/Dep,
            #          7=Father, 8=Spouse, 9=DOB, 10=DOB-Month, 11=POB, 12=Wedding, 13=Wedding-Month,
            #          14=Baptised, 15=Baptism-Date, 16=Baptism-Place, 17=Confirmation, 18=Confirmation-Date,
            #          19=Confirmation-Place, 20=Occupation, 21=Mobile, 22=Email, 23=Residential-Address,
            #          24=Residential-Phone, 25=Office-Address, 26=Office-Phone, ...43=Area, 44=Membership-Type,
            #          45=Membership-ID, 47=Remarks

            def safe_col(idx):
                """Safe column access (1-indexed Excel columns)"""
                try:
                    val = row[idx - 1] if idx <= len(row) else None  # Convert to 0-indexed
                    return str(val).strip() if val and str(val) != 'None' else ''
                except:
                    return ''

            name = safe_col(4)  # Col 4: Full Name
            if not name or len(name) < 2:
                continue

            member = {
                'name': name,
                'email': safe_col(22),  # Col 22: Email ID
                'phone': safe_col(21),  # Col 21: Mobile #
                'phone2': safe_col(24),  # Col 24: Residential Phone #
                'familyHead': 'Head' if 'Head' in safe_col(6) else 'Dependent',  # Col 6
                'familyNumber': safe_col(3),  # Col 3: Family #
                'area': safe_col(43),  # Col 43: Recommended Area Fellowship
                'address': safe_col(23),  # Col 23: Residential Address
                'dateOfBirth': safe_col(9),  # Col 9: Date of Birth
                'maritalStatus': '',  # Not in Excel
                'spouseName': safe_col(8),  # Col 8: Spouse Name
                'membershipStatus': safe_col(1),  # Col 1: Category
                'monthlyContribution': '',
                'remarks': safe_col(47),  # Col 47: Remarks
                'child1': '',
                'child2': '',
                'child3': '',
                'child4': '',
                'dateOfBaptism': safe_col(15),  # Col 15: Date of Baptism
                'dateOfConfirmation': safe_col(18),  # Col 18: Date of Confirmation
                'dateOfJoining': safe_col(39),  # Col 39: Date of Reception
                'dateOfLeaving': '',
                'profileImage': None,
                'occupation': safe_col(20),  # Col 20: Profession / Occupation
                'membershipId': safe_col(45),  # Col 45: Membership ID
            }

            members.append(member)

        return members
    except Exception as e:
        print(f"❌ Error reading Excel: {e}")
        raise

def import_members(members):
    """Import all members with complete data"""
    print(f"🚀 Importing {len(members)} members with COMPLETE data...\n")

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
                    "occupation": {"stringValue": member.get('occupation', '')},
                    "membershipId": {"stringValue": member.get('membershipId', '')},
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
                    print(f"  [{percent:3d}%] ✅ {idx}/{len(members)}")
            else:
                failed += 1

            if idx % 15 == 0:
                time.sleep(0.3)

        except Exception as e:
            failed += 1

    print(f"\n✅ COMPLETE!\n")
    print(f"📊 Results:")
    print(f"   ✅ Imported: {imported}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📈 Total: {imported}\n")
    print(f"📋 Columns imported:")
    print(f"   • Name, Email, Phone (2x)")
    print(f"   • Address, Area, Occupation")
    print(f"   • Family Info (Head, Number)")
    print(f"   • Dates (Birth, Baptism, Confirmation, Joining)")
    print(f"   • Membership ID & Status")
    print(f"   • Remarks\n")
    print(f"🌐 View: http://localhost:8000/admin-portal.html\n")

if __name__ == '__main__':
    try:
        print("=" * 50)
        print("🏦 Church Nexus - COMPLETE Import")
        print("=" * 50 + "\n")

        members = read_excel_complete(EXCEL_FILE)
        print(f"✅ Loaded {len(members)} members\n")

        import_members(members)

    except Exception as e:
        print(f"\n❌ Error: {e}")

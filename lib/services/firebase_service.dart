import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/models.dart';

class FirebaseService {
  static final FirebaseService _instance = FirebaseService._internal();

  factory FirebaseService() {
    return _instance;
  }

  FirebaseService._internal();

  final FirebaseAuth _auth = FirebaseAuth.instance;
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  Future<void> initializeFirebase() async {
    await Firebase.initializeApp();
  }

  Future<UserCredential?> signUp(String email, String password, String name) async {
    try {
      final UserCredential userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      await userCredential.user?.updateDisplayName(name);

      await _firestore.collection('users').doc(userCredential.user!.uid).set({
        'id': userCredential.user!.uid,
        'name': name,
        'email': email,
        'photoUrl': null,
        'joinedDate': DateTime.now(),
      });

      return userCredential;
    } catch (e) {
      return null;
    }
  }

  Future<UserCredential?> signIn(String email, String password) async {
    try {
      return await _auth.signInWithEmailAndPassword(
        email: email,
        password: password,
      );
    } catch (e) {
      return null;
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }

  AppUser? getCurrentUser() {
    return _auth.currentUser != null
        ? AppUser(
            id: _auth.currentUser!.uid,
            name: _auth.currentUser!.displayName ?? 'User',
            email: _auth.currentUser!.email ?? '',
            photoUrl: _auth.currentUser!.photoURL,
            joinedDate: _auth.currentUser!.metadata.creationTime ?? DateTime.now(),
          )
        : null;
  }

  Stream<List<Event>> getEvents() {
    return _firestore.collection('events').snapshots().map((snapshot) =>
        snapshot.docs.map((doc) => Event.fromMap(doc.data())).toList());
  }

  Future<void> addEvent(Event event) async {
    await _firestore.collection('events').doc(event.id).set(event.toMap());
  }

  Stream<List<Sermon>> getSermons() {
    return _firestore
        .collection('sermons')
        .orderBy('date', descending: true)
        .snapshots()
        .map((snapshot) =>
            snapshot.docs.map((doc) => Sermon.fromMap(doc.data())).toList());
  }

  Future<void> addSermon(Sermon sermon) async {
    await _firestore.collection('sermons').doc(sermon.id).set(sermon.toMap());
  }

  Stream<List<PrayerRequest>> getPrayerRequests() {
    return _firestore
        .collection('prayer_requests')
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => PrayerRequest.fromMap(doc.data()))
            .toList());
  }

  Future<void> addPrayerRequest(PrayerRequest request) async {
    await _firestore
        .collection('prayer_requests')
        .doc(request.id)
        .set(request.toMap());
  }

  Future<void> prayForRequest(String requestId) async {
    await _firestore.collection('prayer_requests').doc(requestId).update({
      'prayerCount': FieldValue.increment(1),
    });
  }

  Future<AppUser?> getUserById(String userId) async {
    final doc = await _firestore.collection('users').doc(userId).get();
    return doc.exists ? AppUser.fromMap(doc.data()!) : null;
  }
}

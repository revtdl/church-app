class Event {
  final String id;
  final String title;
  final String description;
  final DateTime startTime;
  final DateTime endTime;
  final String location;
  final String? imageUrl;

  Event({
    required this.id,
    required this.title,
    required this.description,
    required this.startTime,
    required this.endTime,
    required this.location,
    this.imageUrl,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'title': title,
    'description': description,
    'startTime': startTime,
    'endTime': endTime,
    'location': location,
    'imageUrl': imageUrl,
  };

  factory Event.fromMap(Map<String, dynamic> map) => Event(
    id: map['id'],
    title: map['title'],
    description: map['description'],
    startTime: (map['startTime']).toDate(),
    endTime: (map['endTime']).toDate(),
    location: map['location'],
    imageUrl: map['imageUrl'],
  );
}

class Sermon {
  final String id;
  final String title;
  final String speaker;
  final String description;
  final DateTime date;
  final String? videoUrl;
  final String? audioUrl;

  Sermon({
    required this.id,
    required this.title,
    required this.speaker,
    required this.description,
    required this.date,
    this.videoUrl,
    this.audioUrl,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'title': title,
    'speaker': speaker,
    'description': description,
    'date': date,
    'videoUrl': videoUrl,
    'audioUrl': audioUrl,
  };

  factory Sermon.fromMap(Map<String, dynamic> map) => Sermon(
    id: map['id'],
    title: map['title'],
    speaker: map['speaker'],
    description: map['description'],
    date: (map['date']).toDate(),
    videoUrl: map['videoUrl'],
    audioUrl: map['audioUrl'],
  );
}

class PrayerRequest {
  final String id;
  final String userId;
  final String title;
  final String description;
  final DateTime createdAt;
  final int prayerCount;

  PrayerRequest({
    required this.id,
    required this.userId,
    required this.title,
    required this.description,
    required this.createdAt,
    this.prayerCount = 0,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'userId': userId,
    'title': title,
    'description': description,
    'createdAt': createdAt,
    'prayerCount': prayerCount,
  };

  factory PrayerRequest.fromMap(Map<String, dynamic> map) => PrayerRequest(
    id: map['id'],
    userId: map['userId'],
    title: map['title'],
    description: map['description'],
    createdAt: (map['createdAt']).toDate(),
    prayerCount: map['prayerCount'] ?? 0,
  );
}

class AppUser {
  final String id;
  final String name;
  final String email;
  final String? photoUrl;
  final DateTime joinedDate;

  AppUser({
    required this.id,
    required this.name,
    required this.email,
    this.photoUrl,
    required this.joinedDate,
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'email': email,
    'photoUrl': photoUrl,
    'joinedDate': joinedDate,
  };

  factory AppUser.fromMap(Map<String, dynamic> map) => AppUser(
    id: map['id'],
    name: map['name'],
    email: map['email'],
    photoUrl: map['photoUrl'],
    joinedDate: (map['joinedDate']).toDate(),
  );
}

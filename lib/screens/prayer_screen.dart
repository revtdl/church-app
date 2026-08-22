import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:uuid/uuid.dart';
import '../models/models.dart';
import '../services/firebase_service.dart';

class PrayerScreen extends StatefulWidget {
  const PrayerScreen({super.key});

  @override
  State<PrayerScreen> createState() => _PrayerScreenState();
}

class _PrayerScreenState extends State<PrayerScreen> {
  final FirebaseService _firebaseService = FirebaseService();
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();

  void _addPrayerRequest() {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Add Prayer Request'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                hintText: 'Prayer title',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _descriptionController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'Prayer description',
                border: OutlineInputBorder(),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final user = _firebaseService.getCurrentUser();
              if (user != null &&
                  _titleController.text.isNotEmpty &&
                  _descriptionController.text.isNotEmpty) {
                final request = PrayerRequest(
                  id: const Uuid().v4(),
                  userId: user.id,
                  title: _titleController.text,
                  description: _descriptionController.text,
                  createdAt: DateTime.now(),
                );
                await _firebaseService.addPrayerRequest(request);
                _titleController.clear();
                _descriptionController.clear();
                // ignore: use_build_context_synchronously
                Navigator.pop(dialogContext);
              }
            },
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Prayer Requests'),
        elevation: 0,
        backgroundColor: Colors.blue.shade700,
      ),
      body: StreamBuilder<List<PrayerRequest>>(
        stream: _firebaseService.getPrayerRequests(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(
              child: Text('No prayer requests yet'),
            );
          }

          final requests = snapshot.data!;
          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: requests.length,
            itemBuilder: (context, index) {
              final request = requests[index];
              return Card(
                margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 8),
                child: ExpansionTile(
                  leading: const Icon(Icons.favorite, color: Colors.red),
                  title: Text(request.title),
                  subtitle: Text('Prayers: ${request.prayerCount}'),
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            DateFormat('MMM dd, yyyy – hh:mm a')
                                .format(request.createdAt),
                            style: const TextStyle(
                              color: Colors.grey,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 12),
                          Text(request.description),
                          const SizedBox(height: 16),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton.icon(
                              onPressed: () async {
                                await _firebaseService.prayForRequest(request.id);
                              },
                              icon: const Icon(Icons.favorite),
                              label: const Text('I\'m Praying for This'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _addPrayerRequest,
        backgroundColor: Colors.blue.shade700,
        child: const Icon(Icons.add),
      ),
    );
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }
}

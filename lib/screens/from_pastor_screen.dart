import 'package:flutter/material.dart';

class FromPastorScreen extends StatelessWidget {
  const FromPastorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('From the Pastor'),
        backgroundColor: Colors.brown,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'A Message of Hope',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'By Pastor John',
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Dear Church Family,\n\n'
                    'I am blessed to share with you this week a message of hope and encouragement. '
                    'As we navigate through these times, let us remember that our faith is the foundation '
                    'of our strength.\n\n'
                    'Join us this Sunday for a deeper exploration of this message.',
                    style: TextStyle(fontSize: 14, height: 1.6),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Aug 22, 2026',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Walking in Faith',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'By Pastor John',
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'This week, let\'s focus on how our faith in God can transform our daily lives. '
                    'Faith is not just a belief, but an active practice of trusting God in all circumstances.',
                    style: TextStyle(fontSize: 14, height: 1.6),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Aug 15, 2026',
                    style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

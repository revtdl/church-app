import 'package:flutter/material.dart';

class WebsiteScreen extends StatelessWidget {
  const WebsiteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Website'),
        backgroundColor: Colors.indigo,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.language, size: 64, color: Colors.indigo),
              const SizedBox(height: 20),
              const Text(
                'Visit Our Website',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              const Text(
                'More information and resources are available on our website.',
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {
                  // In a real app, this would open the URL
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Website link opening...')),
                  );
                },
                child: const Text('Open Website'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

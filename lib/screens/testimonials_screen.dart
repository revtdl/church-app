import 'package:flutter/material.dart';

class TestimonialsScreen extends StatelessWidget {
  const TestimonialsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final testimonials = [
      TestimonialData(
        title: 'Financial Blessings',
        author: 'Sarah Johnson',
        content: 'God has blessed my family abundantly. Through prayer and faith, we\'ve seen miracles in our finances.',
        imageUrl: 'assets/testimonial1.jpg',
      ),
      TestimonialData(
        title: 'Spiritual Growth',
        author: 'Michael Smith',
        content: 'This church community has helped me grow spiritually in ways I never expected. God is good!',
        imageUrl: 'assets/testimonial2.jpg',
      ),
      TestimonialData(
        title: 'Healing & Hope',
        author: 'Maria Garcia',
        content: 'During my darkest time, this church community lifted me up. I found healing through faith.',
        imageUrl: 'assets/testimonial3.jpg',
      ),
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF3D3B6C),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () {},
        ),
        title: const Text('View Testimonials'),
        actions: [
          IconButton(
            icon: const Icon(Icons.home),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: testimonials.length,
        itemBuilder: (context, index) {
          final testimonial = testimonials[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 16),
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 180,
                  decoration: BoxDecoration(
                    color: Colors.grey[300],
                    borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(12),
                      topRight: Radius.circular(12),
                    ),
                    image: DecorationImage(
                      image: AssetImage(testimonial.imageUrl),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        testimonial.title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF3D3B6C),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'By ${testimonial.author}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        testimonial.content,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[700],
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class TestimonialData {
  final String title;
  final String author;
  final String content;
  final String imageUrl;

  TestimonialData({
    required this.title,
    required this.author,
    required this.content,
    required this.imageUrl,
  });
}

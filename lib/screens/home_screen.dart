import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'featured_screen.dart';
import 'sermons_screen.dart';
import 'events_screen.dart';
import 'prayer_screen.dart';
import 'testimonials_screen.dart';
import 'offering_screen.dart';
import 'announcements_screen.dart';
import 'website_screen.dart';
import 'from_pastor_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  late List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      const DashboardTab(),
      const FeaturedScreen(),
      const SermonsScreen(),
      const EventsScreen(),
      const PrayerScreen(),
      const OfferingScreen(),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.shifting,
        backgroundColor: const Color(0xFF3D3B6C),
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.white70,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.star), label: 'Featured'),
          BottomNavigationBarItem(icon: Icon(Icons.mic), label: 'Sermons'),
          BottomNavigationBarItem(icon: Icon(Icons.calendar_today), label: 'Events'),
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Prayer'),
          BottomNavigationBarItem(icon: Icon(Icons.card_giftcard), label: 'Offering'),
        ],
      ),
    );
  }
}

class DashboardTab extends StatelessWidget {
  const DashboardTab({super.key});

  void _navigateToFeature(BuildContext context, int index, String label) {
    final screens = [
      const FeaturedScreen(),     // Connect
      const EventsScreen(),       // Events
      const SermonsScreen(),      // Sermons
      const PrayerScreen(),       // Prayers
      const TestimonialsScreen(), // Testimonials
      const AnnouncementsScreen(),// Announcements
      const OfferingScreen(),     // Offering
      const WebsiteScreen(),      // Website
      const FromPastorScreen(),   // From the Pastor
    ];

    if (index < screens.length) {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => screens[index]),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final List<MenuItemData> menuItems = [
      MenuItemData(
        icon: Icons.handshake,
        label: 'Connect',
        color: Colors.blue,
      ),
      MenuItemData(
        icon: Icons.calendar_today,
        label: 'Events',
        color: Colors.purple,
      ),
      MenuItemData(
        icon: Icons.mic,
        label: 'Sermons',
        color: Colors.amber,
      ),
      MenuItemData(
        icon: Icons.favorite,
        label: 'Prayers',
        color: Colors.red,
      ),
      MenuItemData(
        icon: Icons.chat_bubble,
        label: 'Testimonials',
        color: Colors.teal,
      ),
      MenuItemData(
        icon: Icons.notifications,
        label: 'Announcements',
        color: Colors.orange,
      ),
      MenuItemData(
        icon: Icons.card_giftcard,
        label: 'Offering',
        color: Colors.green,
      ),
      MenuItemData(
        icon: Icons.language,
        label: 'Website',
        color: Colors.indigo,
      ),
      MenuItemData(
        icon: Icons.person,
        label: 'From the Pastor',
        color: Colors.brown,
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
        title: const Text('Church Nexus'),
        actions: [
          IconButton(
            icon: const Icon(Icons.home),
            onPressed: () {},
          ),
        ],
      ),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 0.85,
        ),
        itemCount: menuItems.length,
        itemBuilder: (context, index) {
          final item = menuItems[index];
          final screens = [
            const FeaturedScreen(),
            const EventsScreen(),
            const SermonsScreen(),
            const PrayerScreen(),
            const TestimonialsScreen(),
            const AnnouncementsScreen(),
            const OfferingScreen(),
            const WebsiteScreen(),
            const FromPastorScreen(),
          ];

          return GestureDetector(
            onTap: () {
              if (index < screens.length) {
                Navigator.push(context, MaterialPageRoute(builder: (_) => screens[index]));
              }
            },
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    item.color.withOpacity(0.8),
                    item.color,
                  ],
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.2),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    item.icon,
                    size: 48,
                    color: Colors.white,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    item.label,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class MenuItemData {
  final IconData icon;
  final String label;
  final Color color;

  MenuItemData({
    required this.icon,
    required this.label,
    required this.color,
  });
}

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Church App'),
        elevation: 0,
        backgroundColor: Colors.blue.shade700,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              color: Colors.blue.shade700,
              padding: const EdgeInsets.all(20),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome, Member!',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Grace and peace to you in Christ',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Upcoming Events',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: const ListTile(
                      leading: Icon(Icons.event, color: Colors.blue),
                      title: Text('Sunday Service'),
                      subtitle: Text('Aug 24, 2026 – 10:00 AM'),
                    ),
                  ),
                  Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    child: const ListTile(
                      leading: Icon(Icons.event, color: Colors.green),
                      title: Text('Prayer Meeting'),
                      subtitle: Text('Aug 26, 2026 – 07:00 PM'),
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Latest Sermon',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  Card(
                    child: const Padding(
                      padding: EdgeInsets.all(12),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Faith in Action',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'by Pastor John',
                            style: TextStyle(color: Colors.grey),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Aug 18, 2026',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

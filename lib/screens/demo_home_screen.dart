import 'package:flutter/material.dart';

class DemoHomeScreen extends StatefulWidget {
  const DemoHomeScreen({super.key});

  @override
  State<DemoHomeScreen> createState() => _DemoHomeScreenState();
}

class _DemoHomeScreenState extends State<DemoHomeScreen> {
  int _selectedIndex = 0;
  static const darkBlue = Color(0xFF2D3561);
  static const lightBlue = Color(0xFF5B7C9E);

  final List<Widget> _screens = [
    const DemoHomeTab(),
    const DemoEventsScreen(),
    const DemoSermonsScreen(),
    const DemoPrayerScreen(),
    const DemoProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: Colors.white,
        selectedItemColor: darkBlue,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.event), label: 'Events'),
          BottomNavigationBarItem(icon: Icon(Icons.play_circle), label: 'Sermons'),
          BottomNavigationBarItem(icon: Icon(Icons.favorite), label: 'Prayer'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}

class DemoHomeTab extends StatelessWidget {
  const DemoHomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    const darkBlue = Color(0xFF2D3561);
    const lightBlue = Color(0xFF5B7C9E);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Church Nexus'),
        elevation: 0,
        backgroundColor: darkBlue,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header
            Container(
              color: darkBlue,
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Welcome to our Worship Community',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    '"For those who are led by the Spirit of God are the children of God"\n— Romans 8:14',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 12,
                      fontStyle: FontStyle.italic,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 15),
                  Row(
                    children: [
                      const Icon(Icons.schedule, color: Colors.white70, size: 18),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text(
                              'Service Times',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 11,
                              ),
                            ),
                            Text(
                              'English 10:30 AM | Tamil 8:00 AM | Hindi 8:00 AM',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 10,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Main Content
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Word of the Day
                  Card(
                    elevation: 2,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        gradient: LinearGradient(
                          colors: [lightBlue.withOpacity(0.1), darkBlue.withOpacity(0.05)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                      ),
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.menu_book, color: darkBlue, size: 24),
                              const SizedBox(width: 10),
                              const Text(
                                'Word of the Day',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: darkBlue,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 15),
                          const Text(
                            '"Go therefore and make disciples of all the nations" — Matthew 28:19',
                            style: TextStyle(
                              fontSize: 13,
                              fontStyle: FontStyle.italic,
                              color: Color(0xFF333333),
                              height: 1.6,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Upcoming Events
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Upcoming Events',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: darkBlue,
                        ),
                      ),
                      Text(
                        'View all',
                        style: TextStyle(
                          fontSize: 12,
                          color: lightBlue,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),

                  EventCard(
                    title: 'Independence Day WSCS Day Out',
                    date: 'Aug 15, 2026',
                    icon: Icons.celebration,
                  ),
                  EventCard(
                    title: 'Football Tournament',
                    date: 'Aug 22, 2026 • 4:00 PM',
                    icon: Icons.sports_soccer,
                  ),
                  EventCard(
                    title: 'Family Retreat (English)',
                    date: 'Aug 30, 2026',
                    icon: Icons.group,
                  ),

                  const SizedBox(height: 28),

                  // August Theme
                  Row(
                    children: [
                      Icon(Icons.star, color: darkBlue, size: 24),
                      const SizedBox(width: 10),
                      const Text(
                        'August Theme',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: darkBlue,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(15),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'The Holy Spirit Leads You',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: darkBlue,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Journey through Truth, Holiness, Courage, Freedom, and Meekness',
                            style: TextStyle(
                              fontSize: 13,
                              color: Color(0xFF666666),
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Contact Info
                  Card(
                    color: const Color(0xFFF8F9FA),
                    child: Padding(
                      padding: const EdgeInsets.all(15),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Contact Us',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: darkBlue,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: const [
                              Icon(Icons.phone, size: 18, color: lightBlue),
                              SizedBox(width: 10),
                              Text('+91 9986012000', style: TextStyle(fontSize: 13)),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: const [
                              Icon(Icons.location_on, size: 18, color: lightBlue),
                              SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  '690, Sathya Sai Layout, Whitefield, Bengaluru',
                                  style: TextStyle(fontSize: 12),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Row(
                            children: const [
                              Icon(Icons.web, size: 18, color: lightBlue),
                              SizedBox(width: 10),
                              Text('whitefieldmethodistchurch.com', style: TextStyle(fontSize: 12)),
                            ],
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

class EventCard extends StatelessWidget {
  final String title;
  final String date;
  final IconData icon;

  const EventCard({
    required this.title,
    required this.date,
    required this.icon,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    const darkBlue = Color(0xFF2D3561);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        leading: Icon(icon, color: darkBlue, size: 28),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
        ),
        subtitle: Text(date, style: const TextStyle(fontSize: 12)),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
      ),
    );
  }
}

class DemoEventsScreen extends StatelessWidget {
  const DemoEventsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const darkBlue = Color(0xFF2D3561);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Church Events'),
        elevation: 0,
        backgroundColor: darkBlue,
      ),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: [
          EventDetailCard(
            title: 'Independence Day WSCS Day Out',
            date: 'Aug 15, 2026',
            description: 'Annual women\'s fellowship gathering',
            location: 'Church Compound',
            icon: Icons.celebration,
          ),
          EventDetailCard(
            title: 'Football Tournament',
            date: 'Aug 22, 2026',
            description: 'Youth sports activity - 4:00 PM',
            location: 'Church Sports Field',
            icon: Icons.sports_soccer,
          ),
          EventDetailCard(
            title: 'Family Retreat (English)',
            date: 'Aug 30, 2026',
            description: 'Family bonding and spiritual renewal',
            location: 'Retreat Center',
            icon: Icons.group,
          ),
          EventDetailCard(
            title: 'Dawn Service',
            date: 'Sep 1, 2026',
            description: 'Early morning worship - 6:30 AM (Online)',
            location: 'Online',
            icon: Icons.wb_sunny,
          ),
        ],
      ),
    );
  }
}

class EventDetailCard extends StatelessWidget {
  final String title;
  final String date;
  final String description;
  final String location;
  final IconData icon;

  const EventDetailCard({
    required this.title,
    required this.date,
    required this.description,
    required this.location,
    required this.icon,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    const darkBlue = Color(0xFF2D3561);

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: darkBlue, size: 28),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: darkBlue,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(date, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(description, style: const TextStyle(fontSize: 13, color: Color(0xFF555555))),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.location_on, size: 16, color: Color(0xFF5B7C9E)),
                const SizedBox(width: 6),
                Text(location, style: const TextStyle(fontSize: 12, color: Color(0xFF5B7C9E))),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class DemoSermonsScreen extends StatelessWidget {
  const DemoSermonsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const darkBlue = Color(0xFF2D3561);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Sermons'),
        elevation: 0,
        backgroundColor: darkBlue,
      ),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: const [
          SermonCard(
            title: 'Love Your Neighbor',
            speaker: 'Pastor David Livingston',
            date: 'Aug 17, 2026',
            description: 'A powerful message about loving our neighbors',
          ),
          SermonCard(
            title: 'The Holy Spirit Leads You',
            speaker: 'Rev. David Livingston',
            date: 'Aug 10, 2026',
            description: 'Understanding the guidance of the Holy Spirit',
          ),
          SermonCard(
            title: 'Go Make Disciples',
            speaker: 'Church Leadership',
            date: 'Aug 3, 2026',
            description: 'The great commission - sharing the gospel',
          ),
        ],
      ),
    );
  }
}

class SermonCard extends StatelessWidget {
  final String title;
  final String speaker;
  final String date;
  final String description;

  const SermonCard({
    required this.title,
    required this.speaker,
    required this.date,
    required this.description,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    const darkBlue = Color(0xFF2D3561);

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(15),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.play_circle, color: darkBlue, size: 40),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: darkBlue),
            ),
            const SizedBox(height: 6),
            Text(speaker, style: const TextStyle(fontSize: 12, color: Colors.grey)),
            const SizedBox(height: 4),
            Text(date, style: const TextStyle(fontSize: 11, color: Colors.grey)),
            const SizedBox(height: 10),
            Text(description, style: const TextStyle(fontSize: 12, color: Color(0xFF666666))),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.play_arrow),
                label: const Text('Watch Sermon'),
                style: ElevatedButton.styleFrom(backgroundColor: darkBlue),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class DemoPrayerScreen extends StatefulWidget {
  const DemoPrayerScreen({super.key});

  @override
  State<DemoPrayerScreen> createState() => _DemoPrayerScreenState();
}

class _DemoPrayerScreenState extends State<DemoPrayerScreen> {
  List<PrayerRequest> prayers = [
    PrayerRequest(
      title: 'Health and Healing',
      description: 'Pray for those suffering from illnesses and recovery of loved ones',
      prayerCount: 15,
    ),
    PrayerRequest(
      title: 'Family Matters',
      description: 'Support for families going through challenges and hardships',
      prayerCount: 8,
    ),
    PrayerRequest(
      title: 'Job Search Success',
      description: 'Prayer for finding employment and career opportunities',
      prayerCount: 12,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    const darkBlue = Color(0xFF2D3561);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Prayer Requests'),
        elevation: 0,
        backgroundColor: darkBlue,
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(12),
        itemCount: prayers.length,
        itemBuilder: (context, index) {
          return Card(
            margin: const EdgeInsets.symmetric(vertical: 8),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.favorite, color: Colors.red.shade400, size: 28),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          prayers[index].title,
                          style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: darkBlue),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(prayers[index].description, style: const TextStyle(fontSize: 12, color: Color(0xFF666666))),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '🙏 ${prayers[index].prayerCount} people praying',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: darkBlue),
                      ),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            prayers[index].prayerCount++;
                          });
                        },
                        style: ElevatedButton.styleFrom(backgroundColor: darkBlue),
                        child: const Text('Pray', style: TextStyle(fontSize: 11)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: darkBlue,
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
    );
  }
}

class PrayerRequest {
  final String title;
  final String description;
  int prayerCount;

  PrayerRequest({
    required this.title,
    required this.description,
    required this.prayerCount,
  });
}

class DemoProfileScreen extends StatelessWidget {
  const DemoProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const darkBlue = Color(0xFF2D3561);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        elevation: 0,
        backgroundColor: darkBlue,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              color: darkBlue,
              padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
              child: Center(
                child: Column(
                  children: [
                    CircleAvatar(
                      radius: 50,
                      backgroundColor: Colors.white,
                      child: Icon(Icons.person, size: 50, color: darkBlue),
                    ),
                    const SizedBox(height: 15),
                    const Text(
                      'Church Member',
                      style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 5),
                    const Text(
                      'Church Nexus',
                      style: TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Church Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: darkBlue)),
                  const SizedBox(height: 15),
                  InfoCard(label: 'Service Times', value: 'English: 10:30 AM\nTamil: 8:00 AM\nHindi: 8:00 AM'),
                  InfoCard(label: 'Pastor', value: 'Rev. David Livingston'),
                  InfoCard(label: 'Address', value: '690, Sathya Sai Layout\nWhitefield, Bengaluru'),
                  InfoCard(label: 'Phone', value: '+91 9986012000'),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: () {},
                      icon: const Icon(Icons.logout),
                      label: const Text('Sign Out'),
                      style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
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

class InfoCard extends StatelessWidget {
  final String label;
  final String value;

  const InfoCard({required this.label, required this.value, Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(color: Colors.grey, fontSize: 11, fontWeight: FontWeight.w600)),
            const SizedBox(height: 5),
            Text(value, style: const TextStyle(fontSize: 13, color: Color(0xFF333333))),
          ],
        ),
      ),
    );
  }
}

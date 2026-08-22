import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  late DateTime selectedDate;
  final List<EventData> events = [
    EventData(
      title: 'English Service',
      date: DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day),
      location: 'Main Sanctuary',
      time: '10:30 AM',
    ),
    EventData(
      title: 'Tamil Service',
      date: DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day),
      location: 'Main Sanctuary',
      time: '8:00 AM',
    ),
    EventData(
      title: 'Independence Day - WSCS Day Out',
      date: DateTime(2026, 8, 15),
      location: 'Church Grounds',
      time: 'All Day',
    ),
    EventData(
      title: 'Football Tournament',
      date: DateTime(2026, 8, 22),
      location: 'Sports Ground',
      time: '4:00 PM',
    ),
    EventData(
      title: 'Family Retreat',
      date: DateTime(2026, 8, 30),
      location: 'Retreat Center',
      time: '9:00 AM',
    ),
    EventData(
      title: 'Sunday School',
      date: DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day),
      location: 'Classroom Block',
      time: '9:30 AM',
    ),
    EventData(
      title: 'Area Fellowship',
      date: DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day + 1),
      location: 'Fellowship Hall',
      time: '7:00 PM',
    ),
  ];

  @override
  void initState() {
    super.initState();
    selectedDate = DateTime.now();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF3D3B6C),
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.menu),
          onPressed: () {},
        ),
        title: const Text('Events'),
        actions: [
          IconButton(
            icon: const Icon(Icons.home),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    DateFormat('MMMM yyyy').format(selectedDate),
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF3D3B6C),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: Colors.grey[300]!),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: const [
                              Text('Mo', style: TextStyle(fontSize: 12, color: Colors.grey)),
                              Text('Tu', style: TextStyle(fontSize: 12, color: Colors.grey)),
                              Text('We', style: TextStyle(fontSize: 12, color: Colors.grey)),
                              Text('Th', style: TextStyle(fontSize: 12, color: Colors.grey)),
                              Text('Fr', style: TextStyle(fontSize: 12, color: Colors.grey)),
                              Text('Sa', style: TextStyle(fontSize: 12, color: Colors.grey)),
                              Text('Su', style: TextStyle(fontSize: 12, color: Colors.grey)),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
                          child: GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 7,
                              childAspectRatio: 1,
                            ),
                            itemCount: 42,
                            itemBuilder: (context, index) {
                              return Center(
                                child: GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      selectedDate = DateTime(
                                        selectedDate.year,
                                        selectedDate.month,
                                        (index - 5) + 1,
                                      );
                                    });
                                  },
                                  child: Container(
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: index == selectedDate.day + 5
                                          ? const Color(0xFF3D3B6C)
                                          : Colors.transparent,
                                    ),
                                    child: Center(
                                      child: Text(
                                        '${index - 5 + 1}',
                                        style: TextStyle(
                                          color: index == selectedDate.day + 5
                                              ? Colors.white
                                              : Colors.grey,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Event Name',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF3D3B6C),
                    ),
                  ),
                  const SizedBox(height: 12),
                  ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: events.length,
                    itemBuilder: (context, index) {
                      final event = events[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Row(
                            children: [
                              Icon(
                                Icons.event,
                                color: const Color(0xFF3D3B6C),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      event.title,
                                      style: const TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      event.location,
                                      style: TextStyle(
                                        fontSize: 12,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                event.time,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
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

class EventData {
  final String title;
  final DateTime date;
  final String location;
  final String time;

  EventData({
    required this.title,
    required this.date,
    required this.location,
    required this.time,
  });
}

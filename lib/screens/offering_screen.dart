import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class OfferingScreen extends StatefulWidget {
  const OfferingScreen({super.key});

  @override
  State<OfferingScreen> createState() => _OfferingScreenState();
}

class _OfferingScreenState extends State<OfferingScreen> {
  String selectedCategory = 'General';
  double selectedAmount = 100;
  String selectedPayment = 'Card';
  bool isAnonymous = false;
  final TextEditingController customAmountController = TextEditingController();

  final List<OfferingCategory> categories = [
    OfferingCategory(
      name: 'General',
      icon: Icons.favorite,
      description: 'Support church operations & ministry',
      color: Colors.red,
    ),
    OfferingCategory(
      name: 'Missions',
      icon: Icons.public,
      description: 'Support missionary & outreach work',
      color: Colors.blue,
    ),
    OfferingCategory(
      name: 'Building Fund',
      icon: Icons.apartment,
      description: 'Support church expansion & renovation',
      color: Colors.orange,
    ),
    OfferingCategory(
      name: 'Youth Ministry',
      icon: Icons.people,
      description: 'Support youth programs & activities',
      color: Colors.green,
    ),
    OfferingCategory(
      name: 'Community Care',
      icon: Icons.handshake,
      description: 'Support community service programs',
      color: Colors.teal,
    ),
    OfferingCategory(
      name: 'Special Projects',
      icon: Icons.construction,
      description: 'Support specific church projects',
      color: Colors.purple,
    ),
  ];

  final List<double> quickAmounts = [50, 100, 250, 500, 1000];
  final List<String> paymentMethods = ['Card', 'UPI', 'Bank Transfer', 'Cash'];

  final List<DonationHistory> donationHistory = [
    DonationHistory(
      amount: 500,
      category: 'General',
      date: DateTime.now().subtract(const Duration(days: 7)),
      status: 'Completed',
    ),
    DonationHistory(
      amount: 250,
      category: 'Missions',
      date: DateTime.now().subtract(const Duration(days: 14)),
      status: 'Completed',
    ),
    DonationHistory(
      amount: 1000,
      category: 'Building Fund',
      date: DateTime.now().subtract(const Duration(days: 21)),
      status: 'Completed',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color(0xFF3D3B6C),
          elevation: 0,
          leading: IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () {},
          ),
          title: const Text('Giving & Offerings'),
          actions: [
            IconButton(
              icon: const Icon(Icons.home),
              onPressed: () {},
            ),
          ],
          bottom: const TabBar(
            tabs: [
              Tab(text: 'Make Offering'),
              Tab(text: 'History'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildOfferingTab(),
            _buildHistoryTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildOfferingTab() {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Card
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF3D3B6C),
                      const Color(0xFF3D3B6C).withOpacity(0.8),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Give Generously',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Your contribution supports our ministry & community outreach',
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Category Selection
            const Text(
              'Select Offering Category',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF3D3B6C),
              ),
            ),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.2,
              ),
              itemCount: categories.length,
              itemBuilder: (context, index) {
                final category = categories[index];
                final isSelected = selectedCategory == category.name;
                return GestureDetector(
                  onTap: () {
                    setState(() => selectedCategory = category.name);
                  },
                  child: Card(
                    elevation: isSelected ? 4 : 1,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                      side: BorderSide(
                        color: isSelected ? category.color : Colors.transparent,
                        width: 2,
                      ),
                    ),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(12),
                        color: isSelected
                            ? category.color.withOpacity(0.1)
                            : Colors.white,
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            category.icon,
                            size: 32,
                            color: category.color,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            category.name,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),

            // Amount Selection
            const Text(
              'Select Amount (₹)',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF3D3B6C),
              ),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              runSpacing: 10,
              children: quickAmounts.map((amount) {
                final isSelected = selectedAmount == amount;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      selectedAmount = amount;
                      customAmountController.clear();
                    });
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 10,
                    ),
                    decoration: BoxDecoration(
                      color: isSelected
                          ? const Color(0xFF3D3B6C)
                          : Colors.grey[200],
                      borderRadius: BorderRadius.circular(8),
                      border: isSelected
                          ? Border.all(
                              color: const Color(0xFF3D3B6C),
                              width: 2,
                            )
                          : null,
                    ),
                    child: Text(
                      '₹${amount.toInt()}',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? Colors.white : Colors.black,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            // Custom Amount
            TextField(
              controller: customAmountController,
              keyboardType: TextInputType.number,
              decoration: InputDecoration(
                hintText: 'Enter custom amount',
                prefixText: '₹ ',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(
                    color: Color(0xFF3D3B6C),
                    width: 2,
                  ),
                ),
              ),
              onChanged: (value) {
                if (value.isNotEmpty) {
                  setState(() {
                    selectedAmount = double.tryParse(value) ?? 0;
                  });
                }
              },
            ),
            const SizedBox(height: 24),

            // Payment Method
            const Text(
              'Payment Method',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF3D3B6C),
              ),
            ),
            const SizedBox(height: 12),
            Column(
              children: paymentMethods.map((method) {
                return RadioListTile<String>(
                  value: method,
                  groupValue: selectedPayment,
                  onChanged: (value) {
                    setState(() => selectedPayment = value!);
                  },
                  title: Text(method),
                  contentPadding: EdgeInsets.zero,
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            // Anonymous Checkbox
            CheckboxListTile(
              value: isAnonymous,
              onChanged: (value) {
                setState(() => isAnonymous = value!);
              },
              title: const Text('Make this offering anonymous'),
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 24),

            // Summary Card
            Card(
              elevation: 2,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Offering Summary',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Category:'),
                        Text(
                          selectedCategory,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Amount:'),
                        Text(
                          '₹${selectedAmount.toStringAsFixed(0)}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Payment:'),
                        Text(
                          selectedPayment,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3D3B6C),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                onPressed: () {
                  _showConfirmationDialog();
                },
                child: const Text(
                  'Proceed to Payment',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),

            // Thank you message
            Center(
              child: Text(
                'God loves a cheerful giver - 2 Corinthians 9:7',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                  fontStyle: FontStyle.italic,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: donationHistory.length,
      itemBuilder: (context, index) {
        final donation = donationHistory[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      donation.category,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF3D3B6C),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.green.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        donation.status,
                        style: const TextStyle(
                          fontSize: 11,
                          color: Colors.green,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      DateFormat('MMM dd, yyyy').format(donation.date),
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                    Text(
                      '₹${donation.amount.toInt()}',
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF3D3B6C),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showConfirmationDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        title: const Text('Confirm Offering'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Category: $selectedCategory'),
            const SizedBox(height: 8),
            Text('Amount: ₹${selectedAmount.toStringAsFixed(0)}'),
            const SizedBox(height: 8),
            Text('Payment: $selectedPayment'),
            if (isAnonymous)
              const Padding(
                padding: EdgeInsets.only(top: 8),
                child: Text('This will be recorded anonymously'),
              ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF3D3B6C),
            ),
            onPressed: () {
              Navigator.pop(context);
              _showSuccessDialog();
            },
            child: const Text('Confirm'),
          ),
        ],
      ),
    );
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        title: const Text('Thank You!'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.check_circle,
              color: Colors.green,
              size: 60,
            ),
            const SizedBox(height: 16),
            Text(
              'Your offering of ₹${selectedAmount.toStringAsFixed(0)} has been received.',
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'God bless you for your generosity!',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontStyle: FontStyle.italic,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF3D3B6C),
            ),
            onPressed: () => Navigator.pop(context),
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    customAmountController.dispose();
    super.dispose();
  }
}

class OfferingCategory {
  final String name;
  final IconData icon;
  final String description;
  final Color color;

  OfferingCategory({
    required this.name,
    required this.icon,
    required this.description,
    required this.color,
  });
}

class DonationHistory {
  final double amount;
  final String category;
  final DateTime date;
  final String status;

  DonationHistory({
    required this.amount,
    required this.category,
    required this.date,
    required this.status,
  });
}

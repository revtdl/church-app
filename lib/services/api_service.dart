import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  static const String baseUrl = 'http://YOUR_BACKEND_IP:5678/api';

  static Future<List<dynamic>> fetchEvents() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/events'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to fetch events');
    } catch (e) {
      print('Error fetching events: $e');
      rethrow;
    }
  }

  static Future<dynamic> fetchEvent(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/events/$id'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to fetch event');
    } catch (e) {
      print('Error fetching event: $e');
      rethrow;
    }
  }

  static Future<List<dynamic>> fetchSermons() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/sermons'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to fetch sermons');
    } catch (e) {
      print('Error fetching sermons: $e');
      rethrow;
    }
  }

  static Future<dynamic> fetchSermon(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/sermons/$id'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to fetch sermon');
    } catch (e) {
      print('Error fetching sermon: $e');
      rethrow;
    }
  }

  static Future<List<dynamic>> fetchPrayers() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/prayers'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to fetch prayers');
    } catch (e) {
      print('Error fetching prayers: $e');
      rethrow;
    }
  }

  static Future<List<dynamic>> fetchUsers() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/users'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to fetch users');
    } catch (e) {
      print('Error fetching users: $e');
      rethrow;
    }
  }

  static Future<dynamic> fetchUser(String id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/users/$id'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      throw Exception('Failed to fetch user');
    } catch (e) {
      print('Error fetching user: $e');
      rethrow;
    }
  }
}

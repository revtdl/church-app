class ApiConfig {
  static const String apiBaseUrl = 'http://192.168.x.x:5678/api';

  static const Map<String, String> headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  static String getEventUrl(String eventId) => '$apiBaseUrl/events/$eventId';
  static String getSermonUrl(String sermonId) => '$apiBaseUrl/sermons/$sermonId';
  static String getUserUrl(String userId) => '$apiBaseUrl/users/$userId';
  static String getEventsUrl() => '$apiBaseUrl/events';
  static String getSermonsUrl() => '$apiBaseUrl/sermons';
  static String getPrayersUrl() => '$apiBaseUrl/prayers';
  static String getUsersUrl() => '$apiBaseUrl/users';
}

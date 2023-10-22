import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class Cache {
  static const storage = FlutterSecureStorage();
  static const aOptions = AndroidOptions();
  static const iOptions = IOSOptions(accessibility: KeychainAccessibility.first_unlock);

  static save(String key, String data, {Duration? expiry}) async {
    if (expiry != null) {
      final expiryDate = DateTime.now().add(expiry);
      data = "${expiryDate.millisecondsSinceEpoch}:$data";
    } else {
      data = "0:$data";
    }
    await storage.write(key: key, value: data, aOptions: aOptions, iOptions: iOptions);
  }

  static Future<String?> retrieve(String key) async {
    final value = await storage.read(key: key, aOptions: aOptions, iOptions: iOptions);
    final parts = value?.split(":");
    if (parts != null) {
      final expiry = int.tryParse(parts.removeAt(0));
      if (expiry == 0 || (expiry != null && DateTime.now().millisecondsSinceEpoch < expiry)) {
        return value!.replaceFirst("$expiry:", "");
      }
      print("Cache expired for $key");
      clearKey(key);
      return null;
    }
    return null;
  }

  static clear() {
    storage.deleteAll();
  }

  static clearKey(String key) {
    storage.delete(key: key);
  }

  static Future preserve(String key, Function() function, {Duration? expiry, json = false, useCache = true}) async {
    if (useCache) {
      print("Attempting to use cache for $key");
    }
    dynamic result = useCache ? await retrieve(key) : null;
    if (result != null) {
      print("Cache hit for $key");
      return json ? jsonDecode(result) : result;
    }
    print("Cache miss for $key");
    result = await function();
    if (result != null) save(key, json ? jsonEncode(result) : result, expiry: expiry);
    return result;
  }

  static Future preserveJson(String key, Function() function, {Duration? expiry, useCache = true}) async {
    return await preserve(key, function, expiry: expiry, json: true, useCache: useCache);
  }
}

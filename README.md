

# FirebaseProfilePostApp

A React Native social media application built with Expo and Firebase that demonstrates core concepts of user profile management, image uploading, and real-time post feeds.

## 📱 Project Overview

This app is a mini social media platform that allows users to:
- Create and manage their profile with photo and bio
- Create posts with images and captions
- View a real-time feed of all posts
- Experience smooth navigation between screens

## ✨ Features Implemented

### Core Requirements ✅
- ✅ **Profile Screen** - Display user profile photo, name, and bio
- ✅ **Edit Profile Screen** - Edit bio and upload profile picture
- ✅ **Create Post Screen** - Upload image with caption
- ✅ **Feed Screen** - Display posts in a scrollable list
- ✅ **Image Upload** - Using expo-image-picker
- ✅ **Firebase Storage** - Store images and get download URLs
- ✅ **Firestore Database** - Store user profiles and posts
- ✅ **Real-time Updates** - Posts appear instantly using onSnapshot()

### Bonus Features ✅
- ✅ **Pull-to-refresh** on Feed Screen
- ✅ **Post timestamp** formatting with date and time
- ✅ **Empty state UI** when no posts exist
- ✅ **Character counter** for bio (200 chars) and caption (500 chars)
- ✅ **Loading states** during uploads and data fetching
- ✅ **Profile photo preview** before saving
- ✅ **Remove profile photo** functionality
- ✅ **Floating action buttons** for better UX

## 🛠️ Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development and build toolchain
- **Firebase Firestore** - Cloud database for users and posts
- **Firebase Storage** - Cloud storage for images
- **React Navigation** - Screen navigation
- **expo-image-picker** - Image selection from device

## 📂 Project Structure

```
user-profile/
├── src/
│   ├── screens/
│   │   ├── FeedScreen.js          # Main feed with real-time posts
│   │   ├── ProfileScreen.js       # User profile display
│   │   ├── EditProfileScreen.js   # Edit user profile
│   │   └── CreatePostScreen.js    # Create new posts
│   ├── components/
│   │   ├── PostCard.js           # Post display component
│   │   └── ProfileHeader.js      # Profile header component
│   ├── firebase/
│   │   ├── firebaseConfig.js     # Firebase initialization
│   │   ├── firestoreHelpers.js   # Firestore CRUD operations
│   │   └── storageHelpers.js     # Firebase Storage operations
│   └── utils/
│       └── imagePicker.js        # Image picker utility
├── App.js                        # Main app with navigation
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase account

### Installation

1. **Clone or download the project**
   ```bash
   cd user-profile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**

   a. Go to [Firebase Console](https://console.firebase.google.com/)
   
   b. Create a new project
   
   c. Enable Firestore Database:
      - Go to Firestore Database
      - Create database in test mode (or production with rules)
      - Start collection: `users`
      - Start collection: `posts`
   
   d. Enable Firebase Storage:
      - Go to Storage
      - Get started
      - Use default security rules (or customize)
   
   e. Get your Firebase config:
      - Go to Project Settings > General
      - Scroll to "Your apps"
      - Click web icon (</>)
      - Copy the firebaseConfig object

4. **Update Firebase Configuration**

   Open `src/firebase/firebaseConfig.js` and replace the placeholder values:

   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

5. **Run the app**
   ```bash
   npm start
   ```

6. **Open the app**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 📖 How to Use the App

1. **Feed Screen**
   - View all posts in real-time
   - Pull down to refresh
   - Tap the ➕ button to create a post
   - Tap the 👤 button to view your profile

2. **Create Post**
   - Tap the image placeholder to select a photo
   - Enter a caption (required)
   - Tap "Post" to upload

3. **Profile Screen**
   - View your profile information
   - Tap "Edit Profile" to update

4. **Edit Profile**
   - Add or change your profile photo
   - Update your name and bio
   - Tap "Save Profile" to upload changes

## 🔥 Firebase Collections Structure

### users Collection
```javascript
{
  name: "John Doe",
  bio: "Software developer and coffee enthusiast",
  photoURL: "https://firebasestorage...",
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### posts Collection
```javascript
{
  imageUrl: "https://firebasestorage...",
  caption: "Beautiful sunset today!",
  createdAt: Timestamp
}
```

## 🎨 Key Features Explained

### Real-time Updates
The app uses Firestore's `onSnapshot()` listener to automatically update the feed when new posts are created:
```javascript
const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
  // Updates happen automatically!
});
```

### Image Upload Flow
1. User selects image using expo-image-picker
2. Image is converted to blob
3. Uploaded to Firebase Storage
4. Download URL is obtained
5. URL is saved in Firestore (not the actual file)

### Loading States
All upload operations show loading indicators to improve user experience:
- Profile updates show spinner
- Post creation shows progress
- Feed shows loading while fetching

## 🐛 Troubleshooting

### Firebase Errors
- **"Firebase not configured"**: Update firebaseConfig.js with your credentials
- **"Permission denied"**: Check Firebase Security Rules
- **"Storage upload failed"**: Verify Storage is enabled in Firebase Console

### Image Picker Issues
- **"Permission denied"**: Grant camera/photo library permissions in device settings
- **Image not showing**: Check internet connection and Firebase Storage rules

## 🎯 Future Enhancements

Potential features to add:
- User authentication (login/signup)
- Like and comment functionality
- Delete posts
- Edit posts
- User following system
- Profile page for other users
- Image filters
- Video support

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

MD. Arif Islam
- 📱 Mobile App Developer (React Native & Expo)
- 🚀 Crafting modern, user-friendly & high-performance mobile apps fast!

 🔗 [GitHub](https://github.com/snArifTaim/) [LinkedIn](https://www.linkedin.com/in/sn-arif-dev/)

---

**Note**: Remember to add your Firebase configuration before running the app!
#

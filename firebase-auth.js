// Firebase Authentication Service Functions

import { 
  auth, 
  db, 
  storage,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from './firebase-config.js';

// Sign Up User
export async function signUpUser(email, password, userData) {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data in Firestore
    await addDoc(collection(db, 'users'), {
      uid: user.uid,
      email: email,
      fullName: userData.fullName,
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      accountType: userData.accountType,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // If account type is assessment or both, create assessment candidate record
    if (userData.accountType === 'assessment' || userData.accountType === 'both') {
      await addDoc(collection(db, 'assessmentCandidates'), {
        uid: user.uid,
        candidateName: userData.fullName,
        email: email,
        phone: userData.phone,
        qualification: '',
        academicLevel: '',
        status: 'new',
        applicationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // If account type is training or both, create training applicant record
    if (userData.accountType === 'training' || userData.accountType === 'both') {
      await addDoc(collection(db, 'trainingApplicants'), {
        uid: user.uid,
        applicantName: userData.fullName,
        email: email,
        phone: userData.phone,
        course: '',
        status: 'new',
        applicationDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return { success: true, user: user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign In User
export async function signInUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Sign Out User
export async function signOutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get Current User
export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject(null);
      }
    });
  });
}

// Watch Auth State Changes
export function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

// Get User Profile
export async function getUserProfile(uid) {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Update User Profile
export async function updateUserProfile(uid, userData) {
  try {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'users', querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        ...userData,
        updatedAt: new Date()
      });
      return { success: true };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Upload Profile Picture
export async function uploadProfilePicture(uid, file) {
  try {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 5MB' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    // Create storage reference
    const storageRef = ref(storage, `profile-pictures/${uid}`);
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update user profile with photo URL
    const updateResult = await updateUserProfile(uid, { profilePicture: downloadURL });
    
    if (updateResult.success) {
      return { success: true, url: downloadURL };
    } else {
      return { success: false, error: 'Failed to update profile' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Remove Profile Picture
export async function removeProfilePicture(uid) {
  try {
    // Delete from storage
    const storageRef = ref(storage, `profile-pictures/${uid}`);
    await deleteObject(storageRef);
    
    // Update user profile to remove photo URL
    const updateResult = await updateUserProfile(uid, { profilePicture: null });
    
    return updateResult;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Change User Email
export async function changeUserEmail(newEmail, password) {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    // Reauthenticate user
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);

    // Update email in Firebase Auth
    await updateEmail(user, newEmail);

    // Update email in Firestore
    const updateResult = await updateUserProfile(user.uid, { email: newEmail });

    if (updateResult.success) {
      return { success: true };
    } else {
      return { success: false, error: 'Failed to update profile' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Submit Assessment Candidate Application
export async function submitAssessmentApplication(uid, applicationData) {
  try {
    const q = query(collection(db, 'assessmentCandidates'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'assessmentCandidates', querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        ...applicationData,
        status: 'pending',
        updatedAt: new Date()
      });
      return { success: true };
    }
    return { success: false, error: 'Candidate record not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Submit Training Applicant Application
export async function submitTrainingApplication(uid, applicationData) {
  try {
    const q = query(collection(db, 'trainingApplicants'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docRef = doc(db, 'trainingApplicants', querySnapshot.docs[0].id);
      await updateDoc(docRef, {
        ...applicationData,
        status: 'reviewing',
        updatedAt: new Date()
      });
      return { success: true };
    }
    return { success: false, error: 'Applicant record not found' };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get Assessment Candidates (Admin)
export async function getAssessmentCandidates() {
  try {
    const querySnapshot = await getDocs(collection(db, 'assessmentCandidates'));
    const candidates = [];
    querySnapshot.forEach((doc) => {
      candidates.push({ id: doc.id, ...doc.data() });
    });
    return candidates;
  } catch (error) {
    console.error('Error getting assessment candidates:', error);
    return [];
  }
}

// Get Training Applicants (Admin)
export async function getTrainingApplicants() {
  try {
    const querySnapshot = await getDocs(collection(db, 'trainingApplicants'));
    const applicants = [];
    querySnapshot.forEach((doc) => {
      applicants.push({ id: doc.id, ...doc.data() });
    });
    return applicants;
  } catch (error) {
    console.error('Error getting training applicants:', error);
    return [];
  }
}

// Update Assessment Candidate Status (Admin)
export async function updateAssessmentStatus(docId, newStatus) {
  try {
    const docRef = doc(db, 'assessmentCandidates', docId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Update Training Applicant Status (Admin)
export async function updateTrainingStatus(docId, newStatus) {
  try {
    const docRef = doc(db, 'trainingApplicants', docId);
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Watch Assessment Candidates in Real-time (Admin)
export function watchAssessmentCandidates(callback) {
  return onSnapshot(collection(db, 'assessmentCandidates'), (snapshot) => {
    const candidates = [];
    snapshot.forEach((doc) => {
      candidates.push({ id: doc.id, ...doc.data() });
    });
    callback(candidates);
  });
}

// Watch Training Applicants in Real-time (Admin)
export function watchTrainingApplicants(callback) {
  return onSnapshot(collection(db, 'trainingApplicants'), (snapshot) => {
    const applicants = [];
    snapshot.forEach((doc) => {
      applicants.push({ id: doc.id, ...doc.data() });
    });
    callback(applicants);
  });
}

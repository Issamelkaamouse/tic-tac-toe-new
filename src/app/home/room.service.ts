import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(private firestore: AngularFirestore) {}

  // Method to create a room
  createRoom(roomId: string, roomData: any): Promise<void> {
    return this.firestore
      .collection('rooms')
      .doc(roomId)
      .set(roomData);  // Set the room data at the specified room ID
  }

  getRoomById(roomId: string): Observable<any> {
    return this.firestore.collection('rooms').doc(roomId).snapshotChanges().pipe(
      map(snapshot => {
        if (snapshot.payload.exists) {
          return { id: snapshot.payload.id, ...snapshot.payload.data() as any };
        }
        return null;
      })
    );
  }

   // Method to update specific fields of a room
   updateRoom(roomId: string, data: Partial<any>): Promise<void> {
    return this.firestore.collection('rooms').doc(roomId).update(data);
  }
  
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomService } from './room.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  showCreateRoomPopup = false;
  showJoinRoomPopup = false;
  createRoomForm!: FormGroup;
  joinRoomForm!: FormGroup;
  roomId: string = '';
  waiting: boolean = false; // Tracks if we're waiting for another player
  countdown!: number; // 30-second countdown timer
  timerSubscription!: Subscription; // To manage timer subscription
  roomSubscription!: Subscription; // To manage Firestore room subscription

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.createRoomForm = this.fb.group({
      playerName: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.joinRoomForm = this.fb.group({
      roomId: ['', Validators.required],
      playerName: ['', [Validators.required, Validators.minLength(3)]], // Player 2 name
    });
  }


  createRoom(): void {

    if (this.createRoomForm.invalid) {
      this.showCreateRoomPopup = false;
      return;
    }

    const playerName = this.createRoomForm.value.playerName;
    this.roomId = uuidv4();

    const roomData = {
      player1: playerName,
      player2: '',
      board: Array(9).fill(''),
      currentTurn: 'X',
      winner: '',
      status: 'waiting',
      createdAt: new Date(),
    };

    this.roomService.createRoom(this.roomId, roomData).then(() => {
      console.log('Room created successfully');
      this.showCreateRoomPopup = false;
      this.waitForPlayerToJoin(); // Start waiting for the second player
    }).catch((error) => {
      console.error('Error creating room:', error);
    });
  }

  waitForPlayerToJoin(): void {
    this.waiting = true;

    // Start a 30-second countdown
    this.timerSubscription = interval(1000).pipe(take(10)).subscribe({
      next: (secondsElapsed) => {
        this.countdown = 10 - secondsElapsed;
        if (this.countdown <= 1) {

          this.cancelWaiting(); // Timer ends, return to home page
        }
      },
      error: (err) => console.error(err),
    });

    // Listen for changes to the room's `player2` field
    this.roomSubscription = this.roomService.getRoomById(this.roomId).subscribe({
      next: (room) => {
        if (room?.player2) {
          console.log('Player 2 joined:', room.player2);
          this.navigateToGame(); // Redirect to the game if another player joins
        } else {
          console.log('Waiting for Player 2...');
        }
      },
      error: (err) => console.error('Error listening to room updates:', err),
      complete: () => console.log('Room subscription completed'),
    });
  }


  cancelWaiting(): void {
    this.waiting = false;
    this.cleanupSubscriptions();
  }

  navigateToGame(): void {
    this.waiting = false;
    this.cleanupSubscriptions(); // Clean up subscriptions
    this.router.navigate(['/game', this.roomId]); // Redirect to the game route
  }

  joinRoom(): void {
    if (this.joinRoomForm.invalid) {
      this.showJoinRoomPopup = false;
      return;
    }

    const roomId = this.joinRoomForm.value.roomId;
    const playerName = this.joinRoomForm.value.playerName;

    this.roomService.getRoomById(roomId).subscribe(room => {
      if (room) {
        if (!room.player2 || room.player2.trim() === '') {
          // Update room with Player 2's name
          this.roomService.updateRoom(roomId, { player2: playerName }).then(() => {
            console.log('Joined room successfully as Player 2');
            this.showJoinRoomPopup = false;
            this.router.navigate(['/game', roomId]); // Redirect to game route
          }).catch(error => {
            console.error('Error joining room:', error);
          });
        } else {
          console.log('Room already has a Player 2');
        }
      } else {
        console.log('Room not found');
      }
    });
  }


  cleanupSubscriptions(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.roomSubscription) {
      this.roomSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.cleanupSubscriptions();
  }
}

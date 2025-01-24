import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../home/room.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [],
  templateUrl: './game.component.html'
})
export class GameComponent implements OnInit{

  roomId: string = '';
  roomData: any;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService
  ) { }

  ngOnInit(): void {
    // Get the roomId from the URL
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;

    // Fetch the room data from Firestore
    this.roomService.getRoomById(this.roomId).subscribe(room => {
      this.roomData = room;
      console.log('Room data:', this.roomData);
      // Additional logic to handle game flow
    });
  }

}

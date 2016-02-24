# [SkiFree](http://www.nickalzapiedi.com/ski)
Welcome to SkiFree! This is an in browser remake of the classic Windows game [(official site)](http://ski.ihoc.net/).

## Moving Objects
Interestingly, the skier is the only object in this program that *doesn't* move.  All obstacles and ramps have a velocity determined by the direction of the skier.  

## Physics
When physics is enabled, the velocities adjust toward a target velocity to simulate real acceleration, and the "Friction" slider modifies the rate of this change.  With physics disabled, direction change is instant.

## Collisions
Each object has a custom rectangular hit box defined to maximize the accuracy of collision detection.  There is a provision to ensure the same object is not continuously collided with.

## Vectors
The snow monster's velocity is calculated by first determining the direction of the vector between the monster and the skier. Then, the magnitude of the vector is scaled according to the position of the monster relative to the skier.

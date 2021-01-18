export const createPlayer = (
  {
    physics,
    spawnPoint,
    anims,
    atlas,
    atlasInit,
    leftWalk,
    rightWalk,
    frontWalk,
    backWalk
  }, worldLayer, map, camera) => {
  let player = physics.add
    .sprite(spawnPoint.x, spawnPoint.y, atlas /* "atlas" */, atlasInit /* "misa-front" */)
    .setSize(30, 40)
    .setOffset(0, 24);

  // Watch the player and worldLayer for collisions, for the duration of the scene:
  physics.add.collider(player, worldLayer);

  // Create the player's walking animations from the texture atlas. These are stored in the global
  // animation manager so any sprite can access them.
  // const anims; // = this.anims;
  anims.create({
      key: leftWalk, // "misa-left-walk",
      frames: anims.generateFrameNames(atlas, {
        prefix: `${leftWalk}.`,
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
  });
  anims.create({
      key: rightWalk,
      frames: anims.generateFrameNames(atlas, {
        prefix: `${rightWalk}.`,
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
  });
  anims.create({
      key: frontWalk,
      frames: anims.generateFrameNames(atlas, {
        prefix: `${frontWalk}.`,
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
  });
  anims.create({
      key: backWalk,
      frames: anims.generateFrameNames(atlas, {
        prefix: `${backWalk}.`,
        start: 0,
        end: 3,
        zeroPad: 3
      }),
      frameRate: 10,
      repeat: -1
  });

  camera.startFollow(player);
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  return {
    player,
    anims
  }
}

export const updatePlayer = (
  {
    player,
    atlas,
    front,
    left,
    right,
    back,
    leftWalk,
    rightWalk,
    frontWalk,
    backWalk
  }, cursors) => {
  const speed = 175;
  const prevVelocity = player.body.velocity.clone();

  // Stop any previous movement from the last frame
  player.body.setVelocity(0);

  // Horizontal movement
  if (cursors.left.isDown) {
      player.body.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
      player.body.setVelocityX(speed);
  }

  // Vertical movement
  if (cursors.up.isDown) {
      player.body.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
      player.body.setVelocityY(speed);
  }

  // Normalize and scale the velocity so that player can't move faster along a diagonal
  player.body.velocity.normalize().scale(speed);

  // Update the animation last and give left/right animations precedence over up/down animations
  if (cursors.left.isDown) {
      player.anims.play(leftWalk, true);
  } else if (cursors.right.isDown) {
      player.anims.play(rightWalk, true);
  } else if (cursors.up.isDown) {
      player.anims.play(backWalk, true);
  } else if (cursors.down.isDown) {
      player.anims.play(frontWalk, true);
  } else {
      player.anims.stop();

      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) player.setTexture(atlas, left);
      else if (prevVelocity.x > 0) player.setTexture(atlas, right);
      else if (prevVelocity.y < 0) player.setTexture(atlas, back);
      else if (prevVelocity.y > 0) player.setTexture(atlas, front);
  }
}
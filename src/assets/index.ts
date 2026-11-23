/**
 * The complete, fixed asset contract. No other image name exists in this project.
 */
export const assets = {
  bg: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  buttonRect: require('../../assets/button_rect.png'),
  buttonRound: require('../../assets/button_round.png'),
  sprites: [
    require('../../assets/sprite_1.png'),
    require('../../assets/sprite_2.png'),
    require('../../assets/sprite_3.png'),
    require('../../assets/sprite_4.png'),
    require('../../assets/sprite_5.png'),
  ],
};

export const spriteFor = (ingredient: number) =>
  assets.sprites[((ingredient % assets.sprites.length) + assets.sprites.length) % assets.sprites.length];

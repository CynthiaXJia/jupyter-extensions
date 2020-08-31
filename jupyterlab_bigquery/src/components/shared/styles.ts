/** Google theme colors. Blue 600, green red yellow 500 for light theme. All 300 vallues for dark theme.*/

export function gColor(color: 'BLUE' | 'RED' | 'GREEN' | 'YELLOW') {
  const darkTheme =
    document.body.getAttribute('data-jp-theme-light') === 'false';
  console.log('light:', document.body.getAttribute('data-jp-theme-light'));
  switch (color) {
    case 'BLUE':
      return darkTheme ? '#8AB4F8' : '#1A73E8';
    case 'RED':
      return darkTheme ? '#F28B82' : '#EA4335';
    case 'GREEN':
      return darkTheme ? '#81C995' : '#34A853';
    case 'YELLOW':
      return darkTheme ? '#FDD663' : '#FBBC04';
  }
}

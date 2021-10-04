export const generateColor = (title) => { 
    let hash = 0
    let color = '#';
  
    for (var i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash;
    }
  
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 255;
        color += ('00' + value.toString(16)).substr(-2);
    }

    return color
}
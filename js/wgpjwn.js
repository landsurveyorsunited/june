const primes = (function buildPrimesGenerator() {
  const foundPrimes = [2,3,5,7];
  let   primesFoundUpTo = 10;
  
  return function(upTo) {
    if (typeof upTo === 'number') {
      if (upTo > primesFoundUpTo) {
        getNewPrimes(upTo, Math.trunc(primesFoundUpTo/2)*2 - 1);
      }
      return getPrimes(upTo);
    }
    
    return foundPrimes;
  }
  
  function getPrimes(upTo) {
    let i = 0;
    const usefulPrimes = [];
    
    while (i < foundPrimes.length && foundPrimes[i] <= upTo) {
      usefulPrimes.push(foundPrimes[i]);
      i += 1;
    }
    
    return usefulPrimes;
  }
  
  function getNewPrimes(upTo, _at) {
    let i = foundPrimes.length;
    let found = false;
    
    const at = _at + 2;
    
    while (i--) {
      if (!((at / foundPrimes[i])%1)) {
        break;
      } else if (i === 0) {
        foundPrimes.push(at);
      }
    }
    
    if (at >= upTo) {
      primesFoundUpTo = upTo;
      return foundPrimes;
    }
    
    return getNewPrimes(upTo, at);
  }
}());

function between(num, _min, _max) {
  const min = typeof _min === 'number' ?
        _min : 0;
  const max = typeof _max === 'number' ?
        _max : 1;
  
  return Math.max(min, Math.min(max, num));
}

function getRelativeOffsets(x, y, elt) {
  let boundingBox = elt.getBoundingClientRect();
  let relativePosition = {
    x: x - boundingBox.left,
    y: y - boundingBox.top,
  };
  
  return {
    x: between(relativePosition.x / boundingBox.width),
    y: between(relativePosition.y / boundingBox.height),
  }
}

function ancestorsHaveClass(elt, className, _stopAt) {
  const stopAt = _stopAt || document.body;
  while (elt !== stopAt) {
    if (elt.classList.contains(className)) {
      return elt;
    }
    elt = elt.parentNode;
  };
  return false;
}

function addChildEventListener(elt, eventType, func, className, _exact) {
  const exact = _exact || false;
  
  elt.addEventListener('click', e => {
    let target = ancestorsHaveClass(e.target, 'frame', elt);
    if (target) {
      e.preventDefault();
      func(e, elt, target);
      return false;
    }
  }, false);
}

function numbersArray(_from, _to) {
  const from = _from || 0;
  const to   = _to || 10;
  const numbersArray = [];
  
  for (let i = from; i < to+1; ++i) {
    numbersArray.push(i);
  }
  
  return numbersArray;
}

//  FRACTION STUFF
function dec2Frac(fullNumber, _denominator) {
  const denominator = _denominator || 100;
  const decimal     = fullNumber % 1;
  const integer     = fullNumber - decimal;
  let min = 0;
  let max = denominator;
  
  if (decimal < 0.5 / denominator || decimal > 1 - (0.5 / denominator)) {
    return new Fraction(integer, 0, denominator, fullNumber);
  }
  
  return getNext(decimal, denominator);
      
  function getNext(decimal, denominator, _numerator, _previousNumerator, _direction) {
    const direction = _direction || -1;
    const numerator = _numerator || denominator;
    const previousNumerator = _previousNumerator || numerator;
    let nextNumerator;

    if (direction === -1) {
      nextNumerator = Math.round((numerator + min) / 2);
    }

    if (direction === 1) {
      nextNumerator = Math.round((numerator + max) / 2);
    }

    if (nextNumerator !== numerator) {
      if (nextNumerator / denominator > decimal) {
        max = nextNumerator;
        return getNext(decimal, denominator, nextNumerator, numerator,  -1);
      }

      if (nextNumerator / denominator < decimal) {
        min = nextNumerator;
        return getNext(decimal, denominator, nextNumerator, numerator,  1);
      }
    }
    
    const finalNumerator = Math.abs(decimal - nextNumerator / denominator) < Math.abs(decimal - previousNumerator/denominator) ?
      nextNumerator : previousNumerator;
    const accuracy = decimal - (finalNumerator / denominator);

    return new Fraction(integer, finalNumerator, denominator, accuracy);
  }

  function simplestFraction(numerator, denominator) {
    const toCheck = numbersArray(2, numerator);
    let i = toCheck.length;

    while (i--) {
      if (!((numerator/toCheck[i])%1) && !((denominator/toCheck[i])%1)) {
        return {
          numerator: numerator/toCheck[i],
          denominator: denominator/toCheck[i],
        }
      }
    }

    return {
      numerator,
      denominator,
    }
  }

  function Fraction(integer, numerator, denominator, accuracy) {
    this.integer     = integer;
    this.numerator   = numerator;
    this.denominator = denominator;
    this.accuracy       = () => Math.abs(accuracy);
    this.direction      = () => accuracy === 0 ? 0 : accuracy > 0 ? 1 : -1;
    this.value          = () => this.integer + this.numerator / this.denominator;
    this.valueExact     = () => this.integer + this.numerator / this.denominator + this.accuracy();
    this.simpleFraction = () => simplestFraction(this.numerator, this.denominator);
  }
}
//  END == FRACTION STUFF
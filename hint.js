//	치료제 수는 홀수 / 짝수입니다.
function generateOddEvenClue(num) {
    const isOdd = num % 2 !== 0;
    return {
        isTrue: isOdd,
        clue: `이 병동의 치료제 수는 ${isOdd ? '홀수' : '짝수'}입니다.`,
    };
}

//	치료제 수의 자릿수 정보입니다.
function generateDigitCountClue(num) {
    const count = num.toString().length;
    return {
        isTrue: true,
        digitCount: count,
        clue: `이 병동의 치료제 수는 ${count}자리 숫자입니다.`,
    };
}

//	치료제 수는 어떤 수의 약수입니다.
function generateDivisorClue(num) {
    const divisors = [];

    for (let i = 2; i < num; i++) {
        if (num % i === 0) {
            divisors.push(i);
        }
    }

    if (divisors.length === 0) {
        // 소수인 경우
        return {
            isTrue: true,
            clue: `이 병동의 치료제 수는 소수입니다.`,
        };
    } else {
        const divisor = divisors[Math.floor(Math.random() * divisors.length)];
        return {
            isTrue: num % divisor === 0,
            divisor,
            clue: `이 병동의 치료제 수는 ${divisor}의 배수입니다.`,
        };
    }
}


//	치료제 수의 각 자리 숫자의 합입니다.
function generateDigitSumClue(num) {
    const sum = num.toString().split('').reduce((s, d) => s + parseInt(d), 0);
    return {
        isTrue: true,
        digitSum: sum,
        clue: `이 병동의 치료제 수의 각 자리 숫자의 합은 ${sum}입니다.`,
    };
}


//	치료제 수는 어떤 숫자보다 큽니다.
function generateGreaterThanClue(num, min = 10, max = 50) {
    const threshold = Math.floor(Math.random() * (max - min + 1)) + min;
    return {
        isTrue: num > threshold,
        threshold,
        clue: `이 병동의 치료제 수는 ${threshold}보다 ${num > threshold ? '큽니다' : '작거나 같습니다'}.`,
    };
}

//	치료제 수를 N으로 나눴을때 나머지
function generateModClue(num) {
    const n = Math.floor(Math.random() * 10) + 1;
    const remainder = num % n;
    return {
        isTrue: true,
        modulus: n,
        remainder,
        clue: `이 병동의 치료제 수를 ${n}으로 나눈 나머지는 ${remainder}입니다.`,
    };
}

// //	치료제 수는 영어 철자로 썼을 때 알파벳 수가 짝수입니다.
// function generateLetterCountClue(num) {
//     const word = numberToWords.toWords(num).replace(/[\s-]/g, '');
//     const length = word.length;
//     const isEven = length % 2 === 0;
//     return {
//         isTrue: isEven,
//         letterCount: length,
//         clue: `이 병동의 치료제 수를 영어로 적었을 때 알파벳 수는 ${length}이며, ${isEven ? '짝수' : '홀수'}입니다.`,
//     };
// }

//	치료제 수를 뒤집으면 더 작은 숫자가 됩니다.
function generateReverseCompareClue(num) {
    const reversed = parseInt(num.toString().split('').reverse().join(''), 10);
    let comparisonText;

    if (reversed < num) {
        comparisonText = '보다 더 작아집니다';
    } else if (reversed > num) {
        comparisonText = '보다 더 커집니다';
    } else {
        comparisonText = '과 같습니다';
    }

    return {
        isTrue: reversed < num,
        reversed,
        clue: `이 병동의 치료제 수를 뒤집으면 원래 값${comparisonText}.`,
    };
}


// 이하는 배열로 받아야 함

// 병동 간 관계 (예: A + B = C + D 등)
function generateEqualSumPairsClue(roomData, targetWard) {
    const wards = Object.keys(roomData);
    if (wards.length < 4) throw new Error("병동이 최소 4개 이상이어야 합니다.");
    if (!wards.includes(targetWard)) throw new Error("targetWard는 roomData에 존재해야 합니다.");
  
    // targetWard를 제외한 병동 목록
    const remainingWards = wards.filter(w => w !== targetWard);
  
    // 랜덤으로 나머지 병동 중 3개 선택
    const shuffled = [...remainingWards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  
    // targetWard가 포함된 그룹을 랜덤으로 결정 (group1 또는 group2)
    const includeInGroup1 = Math.random() < 0.5;
  
    let group1, group2;
    if (includeInGroup1) {
      group1 = [targetWard, shuffled[0]];
      group2 = [shuffled[1], shuffled[2]];
    } else {
      group1 = [shuffled[0], shuffled[1]];
      group2 = [targetWard, shuffled[2]];
    }
  
    const sum1 = group1.reduce((sum, ward) => sum + roomData[ward], 0);
    const sum2 = group2.reduce((sum, ward) => sum + roomData[ward], 0);
  
    let operator = "=";
    if (sum1 > sum2) operator = ">";
    else if (sum1 < sum2) operator = "<";
  
    return {
      isTrue: sum1 === sum2,
      group1,
      group2,
      clue: `병동 ${group1.join(' + ')} ${operator} 병동 ${group2.join(' + ')}`,
    };
  }
  
  
    
// 치료제가 N번째로 많이 배치된 병동입니다.
// roomData: { A: 22, B: 13, ... }
function generateRankClue(roomData, targetWard) {
    const entries = Object.entries(roomData);
    const sorted = [...entries].sort((a, b) => b[1] - a[1]); // 치료제 수 기준 내림차순 정렬

    // targetWard의 랭킹 찾기
    const actualRank = sorted.findIndex(([ward]) => ward === targetWard) + 1;

    return {
        isTrue: true,
        ward: targetWard,
        rank: actualRank,
        value: roomData[targetWard],
        clue: `병동 ${targetWard}는 치료제 수 기준으로 ${actualRank}번째로 많습니다.`,
    };
}

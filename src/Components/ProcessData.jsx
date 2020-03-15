const GroupInitialAPIData = (APIData, type) => {
  let CurrentData = {
    Date: APIData[0].createdAt.slice(0, 10),
    Data: [APIData[0]]
  };
  let GroupedData = [];
  let PreviousDate = CurrentData.Date;
  let matchingIndex = 0;

  GroupedData.push(CurrentData);

  for (let data = 1; data < APIData.length; data++) {
    if (PreviousDate == APIData[data].createdAt.slice(0, 10)) {
      GroupedData[matchingIndex].Data.push(APIData[data]);
    } else {
      matchingIndex++;
      let CurrentData = {
        Date: APIData[data].createdAt.slice(0, 10),
        Data: [APIData[data]]
      };
      PreviousDate = CurrentData.Date;
      GroupedData.push(CurrentData);
    }
  }
  return GroupedData;
};

const GroupInfiniteImagesScrollData = (currentData, previousData) => {
  let PreviousDate = previousData[previousData.length - 1].Date;
  let matchingIndex = previousData.length - 1;
  for (let data = 0; data < currentData.length; data++) {
    if (PreviousDate == currentData[data].createdAt.slice(0, 10)) {
      previousData[matchingIndex].Data.push(currentData[data]);
    } else {
      matchingIndex++;
      let CurrentData = {
        Date: currentData[data].createdAt.slice(0, 10),
        Data: [currentData[data]]
      };
      PreviousDate.push(CurrentData.Date);
      previousData.push(CurrentData);
    }
  }
  return previousData;
};

export default { GroupInfiniteImagesScrollData, GroupInitialAPIData };

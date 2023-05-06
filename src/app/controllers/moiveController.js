const Moive = require("../models/Moive");
const ShowTime = require("../models/ShowTime");
const Bluebird = require("bluebird");

const Time_MoiveID_Date = async (moiveId) => {
  let timeNow = new Date();     
    timeNow.setHours(0);
    timeNow.setMinutes(0);       
    timeNow.setSeconds(0);
    console.log(timeNow);
    
  const times = await ShowTime.find({ moive: { $in: moiveId } }).lean();
  
  // console.log("time:", times)
  let arrayTime = [];
  let arrayTimeDate = [];

  times.map(async (item, index, times) => {
    const time = new Date(item.time);
    let query = `${time.getDate()}-${
      time.getMonth() + 1
    }-${time.getFullYear()}`;
    //  console.log( "query",query)

    const array = times.filter((item) => {
      const timeItem = new Date(item.time);
      let query1 = `${timeItem.getDate()}-${
        timeItem.getMonth() + 1
      }-${timeItem.getFullYear()}`;
      if (query === query1) {
        return true;
      } else {
        return false;
      }
    });
    arrayTime.push(query);
    if (!arrayTimeDate.find((item) => item.date === query)) {
      arrayTimeDate.push({ time: time, date: query, array: array });
    }
  });
  // Promise.all(arrayTime)
  console.log(arrayTime, arrayTimeDate);
  arrayTimeDate.sort((a, b) => {
    if (a.time > b.time) return 1;
    if (a.time < b.time) return -1;
    return 0;
  });
   arrayTimeDate = arrayTimeDate.filter((item)=> item.time>timeNow);
  return arrayTimeDate;
};

const moiveController = {
  getAllMoive: async (req, res) => {
    try {
      const moives = await Moive.find();
      // console.log(moives);
      res.status(200).json({ moives });
    } catch (err) {
      res.status(401).json(err);
    }
  },
  getMoiveId: async (req, res) => {
    try {
      const moive = await Moive.findById(req.params.moiveId).lean();
      const moiveId = req.params.moiveId;

      // console.log(moiveId);

      arayTimeDate = await Time_MoiveID_Date(moiveId);

      //    console.log(arayTimeDate)
      return res.status(200).json({ moive, arayTimeDate });
      //  res.status(200).json();
      //   return res.status(200).json({product,productsCategory});
    } catch (err) {
      return res.status(401).json(err);
    }
  },

  addMoive: async (req, res) => {
    // console.log(req.body);
    try {
      const newMoive = await new Moive({
        name: req.body.name,
        premiere_date: req.body.premiere_date,
        time: req.body.time,
        director: req.body.director,
        performer: req.body.performer,
        age: req.body.age,
        images: req.body.file,
        trailer: req.body.trailer,
        rating: req.body.rating,
        origin: req.body.origin,
        category: req.body.category,
        description: req.body.description,
      });
      const moive = await newMoive.save();
      // console.log(moive);
      res.status(200).json(moive);
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
    }
  },
  getMoivesAndShowTime: async (req, res) => {
    let timeNow = new Date();     
    timeNow.setHours(0);
   
    timeNow.setMinutes(0);       
    timeNow.setSeconds(0);
    console.log(timeNow);
    console.log(req.query);
    try {
      console.log("MoivesId: ", req.query.moives);
      console.log("Time: ", req.query.time);
      const moives = req.query.moives;

      // const moivesId = moives.split(' ');

      // console.log(moivesId, typeof(moivesId))
      const time_query = new Date(req.query.time);
      console.log(time_query, typeof req.query.time);

      if (moives == "" || (!moives && req.query.time)) {
        console.log("No moives");
        const moives = await Moive.find().lean();

        const array = await Bluebird.map(
          moives,
          async (item) => {
            const times = await ShowTime.find({
              moive: { $in: item._id },
            }).lean();
            let arrayTimeDate = [];

            times.map(async (item) => {
              const time = new Date(item.time);

              let query1 = `${time.getDate()}-${
                time.getMonth() + 1
              }-${time.getFullYear()}`;
              console.log(req.query.time, query1);
              if (req.query.time === query1) {
                arrayTimeDate.push(item);
              }
            });
            const moive = await Moive.findById(item).lean();
            // Promise.all(arrayTime)
            console.log(arrayTimeDate);

            return { moive, time: arrayTimeDate };
          },
          { concurrency: moives.length }
        );
        console.log(array);
        res.status(200).json(array);

        // res.status(200).json("No moives found");
      } 
      
      else if (moives == "" || (!moives && !req.query.time)) {
        console.log("No moives and time");
        const moives = await Moive.find().lean();
        let allShowTime = await ShowTime.find().lean();
        allShowTime.sort((a, b) => {
          if (a.time > b.time) return 1;
          if (a.time < b.time) return -1;
          return 0;
        });
        allShowTime = allShowTime.filter((item)=> item.time>timeNow);
        // console.log(allShowTime);
        let allDate = [];
        allShowTime.map((item) => {
          const time = new Date(item.time);
          // console.log(time);
          allDate.push(
            `${time.getDate()}-${time.getMonth() + 1}-${time.getFullYear()}`
          );
        });

        allDate = [...new Set(allDate)];
        const arrayData = await Bluebird.map(allDate,async (itemDate) => 
        {
            console.log(itemDate);
            const array = await Bluebird.map(moives, async (item) => 
            {
                const times = await ShowTime.find({
                  moive: { $in: item._id },
                }).lean();
                let arrayTimeDate = [];
                times.map(async (item) => {
                  const time = new Date(item.time);

                  let query1 = `${time.getDate()}-${
                    time.getMonth() + 1
                  }-${time.getFullYear()}`;
                  //  console.log(req.query.time ,query1)
                  if (itemDate === query1) {
                    arrayTimeDate.push(item);
                  }
                });
                const moive = await Moive.findById(item).lean();
                // Promise.all(arrayTime)
                // console.log(arrayTimeDate)

                return { moive, time: arrayTimeDate };

              },{ concurrency: moives.length }
            );


            return { date: itemDate, array: array };
          },{ concurrency: allDate.length }
        );

        // console.log(array)
        res.status(200).json(arrayData);

        // res.status(200).json("No moives found");
      } else if (!req.query.time) {
        const moivesId = moives.split(" ");
        
        const arrayMoivesTime = await Bluebird.map(
          moivesId,
          async (item) => {
            return {
              moive: item,
              time: await Time_MoiveID_Date(item),
            };
          },
          { concurrency: moivesId.length }
        );
        console.log(arrayMoivesTime);
        res.status(200).json(arrayMoivesTime);
      } 
      else if (req.query.time) {
        const moivesId = moives.split(" ");
        console.log("moivesId: asdsa" + moivesId);
        // let query = `${time_query.getDate()}-${time_query.getMonth()}-${time_query.getFullYear()}`
        const arrayMoivesTime = await Bluebird.map(
          moivesId,
          async (item) => {
            let times = await ShowTime.find({ moive: { $in: item } }).lean();
            let arrayTimeDate = [];
            // times = times.filter((item)=> item.time>timeNow);
            times.map(async (item) => {
              const time = new Date(item.time);

              let query1 = `${time.getDate()}-${
                time.getMonth() + 1
              }-${time.getFullYear()}`;
              console.log(req.query.time, query1);
              if (req.query.time === query1) {
                arrayTimeDate.push(item);
              }
            });
            const moive = await Moive.findById(item).lean();
            // Promise.all(arrayTime)
            console.log(arrayTimeDate);

            return { moive, date: req.query.time, time: arrayTimeDate };
          },
          { concurrency: moivesId.length }
        );
        console.log(arrayMoivesTime);
        res.status(200).json(arrayMoivesTime);
      }
    } catch (error) {
      console.log(error);
      res.status(401).json(error);
    }
  },
};

module.exports = moiveController;

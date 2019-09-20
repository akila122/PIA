const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const options = { discriminatorKey: "kind" };
const optionsForGeo = { discriminatorKey: "kind"};

const GameSchema = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true
    }
  },
  options
);
const GameModel = mongoose.model("Game", GameSchema);

const QuestionSchema = new Schema(
  {
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    }
  },
  { _id: false }
);
const AnagramSchema = new Schema(
  {
    data: {
      type: QuestionSchema,
      required: true
    }
  },
  options
);

const FivesSchema = new Schema(
  {
    data: {
      type: [String],
      required: true
    }
  },
  options
);

const GrailSchema = new Schema(
  {
    data: {
      type: [QuestionSchema],
      required: true
    }
  },
  options
);

const MyNumSchema = new Schema({}, options);

const GeoSchema = new Schema({}, options);

const GeoAgrSchema = new Schema({}, optionsForGeo);

const GeoAgrModel = mongoose.model("GeoAgr", GeoAgrSchema);

const CountrySchema = new Schema(
  {
    data: {
      type: String,
      required: true,
      unique: true
    }
  },
  optionsForGeo
);

const CitySchema = new Schema(
  {
    data: {
      type: String,
      required: true,
      unique: true
    }
  },
  optionsForGeo
);

const LakeSchema = new Schema(
  {
    data: {
      type: String,
      required: true,
      unique: true
    }
  },
  optionsForGeo
);
const MountainSchema = new Schema(
  {
    data: {
      type: String,
      required: true,
      unique: true
    }
  },
  optionsForGeo
);
const RiverSchema = new Schema(
  {
    data: {
      type: String,
      required: true,
      unique: true
    }
  },
  optionsForGeo
);
const AnimalSchema = new Schema(
  {
    data: {
      type: String,
      required: true,
      unique: true
    }
  },
  optionsForGeo
);
const PlantSchema = new Schema(
  {
    data: {
      type: String,
      required: true,
      unique: true
    }
  },
  optionsForGeo
);
const MusicSchema = new Schema(
  {
    data: {
      type: String,
      required: true,
      unique: true
    }
  },
  optionsForGeo
);

module.exports = {
  AnagramModel: GameModel.discriminator("Anagram", AnagramSchema),
  FivesModel: GameModel.discriminator("Fives", FivesSchema),
  GrailModel: GameModel.discriminator("Grail", GrailSchema),
  MyNumModel: GameModel.discriminator("MyNum", MyNumSchema),
  GeoModel: GameModel.discriminator("Geo", GeoSchema),
  CountryModel: GeoAgrModel.discriminator("Country", CountrySchema),
  CityModel: GeoAgrModel.discriminator("City", CitySchema),
  LakeModel: GeoAgrModel.discriminator("Lake", LakeSchema),
  MountainModel: GeoAgrModel.discriminator("Mountain", MountainSchema),
  RiverModel: GeoAgrModel.discriminator("River", RiverSchema),
  AnimalModel: GeoAgrModel.discriminator("Animal", AnimalSchema),
  PlantModel: GeoAgrModel.discriminator("Plant", PlantSchema),
  MusicModel: GeoAgrModel.discriminator("Music", MusicSchema),
  GameModel: GameModel,
  GeoAgrModel: GeoAgrModel
};

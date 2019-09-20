
export class GameModel {
    _id : String;
    kind : String;
}

export class QuestionModel{
    question : String;
    answer : String;
}

export class AnagramModel extends GameModel {
    data : QuestionModel;
}

export class FivesModel extends GameModel {
    data : String[];
}
export class GrailModel extends GameModel {
    data : QuestionModel[];
}

export class GeoModel extends GameModel {}
export class MyNumModel extends GameModel {}

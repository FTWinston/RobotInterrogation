﻿namespace RobotInterrogation.Models
{
    public enum InterviewOutcome
    {
        Disconnected = 0,
        CorrectlyGuessedHuman,
        WronglyGuessedHuman,
        CorrectlyGuessedRobot,
        WronglyGuessedRobot,
        KilledInterviewer,
    }
}
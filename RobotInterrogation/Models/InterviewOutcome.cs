using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace RobotInterrogation.Models
{
    [JsonConverter(typeof(StringEnumConverter))]
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
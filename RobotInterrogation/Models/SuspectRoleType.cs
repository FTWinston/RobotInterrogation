using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace RobotInterrogation.Models
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum SuspectRoleType
    {
        Human = 0,
        PatientRobot,
        ViolentRobot,
    }
}
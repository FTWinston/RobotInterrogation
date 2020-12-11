using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RobotInterrogation.Models
{
    public class GameInstance
    {
        public List<Player> Players { get; } = new List<Player>();

        public Interview Interview { get; set; } = new Interview();
    }
}

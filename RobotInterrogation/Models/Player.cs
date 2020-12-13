using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RobotInterrogation.Models
{
    public class Player
    {
        public string ConnectionID { get; set; }

        public string Name { get; set; }

        public PlayerPosition Position { get; set; }
    }
}

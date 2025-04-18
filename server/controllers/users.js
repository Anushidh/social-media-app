import User from "../models/User.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath, location, occupation }) => {
        return {
          _id,
          firstName,
          lastName,
          picturePath,
          location,
          occupation,
        };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const addRemoveFriend = async (req, res, next) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, picturePath, location, occupation }) => {
        return {
          _id,
          firstName,
          lastName,
          picturePath,
          location,
          occupation,
        };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

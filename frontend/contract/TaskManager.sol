// SPDX-License-Identifier: MIT

pragma solidity ^0.8.34;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TaskManager is ReentrancyGuard {
    IERC20 public token;
    uint public taskCount;

    struct Task {
        uint id;
        string title;
        string description;
        uint reward;
        uint rewardAfter;
        address client;
        address freelancer;
        bool accepted;
        bool completed;
        bool approved;
        bool rejected;
        string rejectMsg;
        string githubLink;
    }
    struct Proposal {
        address freelancer;
        string message;
        bool requested;
    }
    uint[] public taskIDs;
    mapping(uint => Task) public tasks;
    mapping(uint => Proposal[]) public proposals;
    mapping(uint => mapping(address => bool)) public taskRequested;

    event TaskCreated(uint taskId, address indexed client, uint reward);
    event TaskAccepted(uint taskId, address indexed freelancer);
    event TaskSubmitted(uint taskId, address indexed freelancer);
    event TaskApproved(uint taskId, address indexed client);
    event TaskRequested(uint taskId, address indexed freelancer);
    event TaskDeleted(uint taskId, address indexed client);
    event TaskRejected(uint indexed taskId , address indexed client);
    constructor(address _token) {
        token = IERC20(_token);
    }

    function createTask(
        string memory _title,
        string memory _description,
        uint _reward
    ) public nonReentrant {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_reward > 0, "You must pay the reward");
        taskCount++;
        Task storage task = tasks[taskCount];
        task.id = taskCount;
        task.title = _title;
        task.description = _description;
        task.reward = _reward;
        task.client = msg.sender;
        task.completed = false;
        task.approved = false;
        taskIDs.push(taskCount);

        bool success = token.transferFrom(msg.sender, address(this), _reward);
        require(success, "Failed to transfer tokens");

        emit TaskCreated(taskCount, msg.sender, _reward);
    }

    function requestToAccept(uint taskId , string memory _message) public {
        Task storage task = tasks[taskId];
        require(task.client != address(0), "Task not found");
        require(task.freelancer == address(0), "Already freelancer hired");
        require(task.client != msg.sender, "Client cannot request");
        require(!taskRequested[taskId][msg.sender], "Already requested");

        taskRequested[taskId][msg.sender] = true;
        proposals[taskId].push(
            Proposal({freelancer: msg.sender, message: _message , requested: true})
        );
        emit TaskRequested(taskId, msg.sender);
    }

    function getProposal(uint taskId) view public returns (Proposal[] memory){
        return proposals[taskId];
    }

    function acceptTask(uint taskId, address _freelancer) public {
        Task storage task = tasks[taskId];
        require(!task.completed, "Task Already Completed");
        require(task.client != address(0), "Task does not exist");
        require(task.freelancer == address(0), "Already assigned");
        require(task.client == msg.sender, "Only client can accept task");
        require(!task.accepted, "You already hired freelancer");

        task.freelancer = _freelancer;
        task.accepted = true;

        emit TaskAccepted(taskId, msg.sender);
    }

    function submitTask(uint taskId, string memory _githubLink) public {
        Task storage task = tasks[taskId];
        require(
            task.freelancer == msg.sender,
            "Only the freelancer can submit the task."
        );
        require(!task.completed, "Task has already been submitted.");
        require(bytes(_githubLink).length > 0, "Github link required");
        require(task.accepted, "Freelancer hasn't hired");
        require(task.client != address(0), "Task does not exist");

        task.completed = true;
        task.githubLink = _githubLink;
        task.rejected = false;
        emit TaskSubmitted(taskId, msg.sender);
    }

    function rejectTasks(uint taskId , string memory _rejectGithubLinkMsg) public {
        Task storage task = tasks[taskId];
        require(task.client == msg.sender, "Only the client can reject the task." );
        require(!task.approved, "Task already has been approved" );
        require(task.completed , "Task hasn't completed");
        require(!task.rejected, "Task already been rejected");
        task.rejected = true;
        task.rejectMsg = _rejectGithubLinkMsg;
        task.completed = false;
        emit TaskRejected(taskId , msg.sender);
    }

    function approveTask(uint taskId) public nonReentrant {
        Task storage task = tasks[taskId];
        require(
            task.client == msg.sender,
            "Only the client can approve the task."
        );
        require(
            task.completed,
            "Task has not been submitted by the freelancer."
        );
        require(!task.approved, "Task has already been approved.");

        uint _reward = task.reward;
        require(_reward > 0, "No reward available");
        task.reward = 0;
        bool success = token.transfer(task.freelancer, _reward);
        require(success, "Transaction failed");
        task.approved = true;
        task.rewardAfter = _reward;
        emit TaskApproved(taskId, msg.sender);
    }

    function deleteTask(uint taskId) public {
        Task storage task = tasks[taskId];
        require(
            task.client == msg.sender,
            "Only the client can delete the task."
        );
        require(task.freelancer == address(0), "Freelancer Hired");
        
        uint amount = task.reward;
        task.id = 0;
        task.title = "";
        task.description = "";
        task.reward = 0;
        task.client = address(0);
        bool success = token.transfer(msg.sender, amount);
        require(success, "Transaction failed");
        emit TaskDeleted(taskId, msg.sender);
    }
    function getTask(uint Id) public view returns (Task memory) {
        Task storage task = tasks[Id];
        return task;
    }

    function getAllTaskIds() public view returns (uint[] memory) {
        return taskIDs;
    }
}

//0xF2214deDFF9E7518919661742c9e7041F3D40Db5

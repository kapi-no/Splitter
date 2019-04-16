const Splitter = artifacts.require("Splitter");
const SafeMath = artifacts.require("SafeMath");

module.exports = function(deployer, network, accounts) {
    deployer.deploy(SafeMath).then(() => {
        return deployer.link(SafeMath, Splitter);
    }).then(() => {
        return deployer.deploy(Splitter, accounts[1], accounts[2]);
    });
};